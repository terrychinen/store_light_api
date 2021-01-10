import moment from 'moment';
import { query } from '../query/query';
import jsonWebToken from 'jsonwebtoken';
import { Request, Response } from 'express';
import { TokenModel } from '../models/token.model';
import { EmployeeModel } from '../models/employee.model';


export async function createNewToken(req: Request, res: Response, token: TokenModel, employeeID: number) {
    const createTokenQuery = `INSERT INTO token (token_key, created_at, expires_in, state)
    VALUES ('${token.token_key}', '${token.created_at}', '${token.expires_in}', '1')`;


    //EJECUTAMOS LA CONSULTA DE CREAR EL TOKEN
    return await query(createTokenQuery).then(async createDataToken => {
        if(!createDataToken.ok) return res.status(createDataToken.status).json({ok: false, message: createDataToken.message});

        const tokenId = createDataToken.result[0].insertId;

        const updateUserTokenQuery = `UPDATE employee SET token_id = ${tokenId} 
             WHERE employee_id = ${employeeID}`;


        //EJECUTAMOS LA CONSULTA DE ASOCIAR EL TOKEN CON EL USUARIO CREADO      
        return await query(updateUserTokenQuery).then(updateUserTokenData => {
            if(!updateUserTokenData.ok) return res.status(updateUserTokenData.status).json({ok: false, message: updateUserTokenData.message});
            return res.status(updateUserTokenData.status).json({ok: true, message: 'Usuario creado satisfactoriamente'});
        });
    });
} 


export async function updateNewToken(employee: EmployeeModel, token) {
    if(!token) return ({ok: false, message: 'El token es obligatorio!'});

    const queryString = `SELECT * FROM employee WHERE employee_id = ${employee.employee_id}`;


    //VERIFICA SI EXISTE EL USUARIO
    return await query(queryString).then(async data => {
        const dataCheck = data.result[0][0];
        if(dataCheck == null) {return ({ok: false, message: 'No existe'});}

        const jwt = new TokenModel();
        jwt.token_key = token;
        jwt.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
        jwt.expires_in = Number(process.env.TOKEN_EXPIRATION); 
    

        const queryUpdate = `UPDATE token SET token_key='${jwt.token_key}', created_at='${jwt.created_at}', 
                             expires_in='${jwt.expires_in}' WHERE token_id = ${employee.employee_id}`;

        //GUARDA EL TOKEN
        return await query(queryUpdate).then(dataUpdate => {
            if(!dataUpdate.ok) return ({ok: false, message: dataUpdate.message})
    
            return ({ok: dataUpdate.ok, message: 'Actualizado con exito'});
        });
    });  
}


export async function refreshToken(req: Request, res: Response) {
    const body = req.body;
    const token = body.token;
    const employeeID = body.employee_id;
    
    if(!token) return res.status(406).json({ok: false, message: 'El token es necesario!'});

    const queryCheckToken = `SELECT * FROM token WHERE token_key = "${token}"`;

    //VERIFICA SI EXISTE EL TOKEN
    return await query(queryCheckToken).then(async data => {
        if(data.result[0] == '') return res.status(404).json({ok: false, message: 'No existe el token'});
        if(!data.ok) return res.status(data.status).json({ok: false, message: data.message});
        

        const queryUser = `SELECT * FROM employee WHERE employee_id = "${employeeID}"`;  
    

        //BUSCAMOS AL USUARIO CON SU ID
        return await query(queryUser).then(async dataUser => {
            if(!dataUser.ok) return res.status(dataUser.status).json({ok: false, message: dataUser.message});
            if(dataUser.result[0] == '') return res.status(404).json({ok: false, message: 'El usuario no existe!'});

            const  employeeDB: EmployeeModel = dataUser.result[0][0];
            delete employeeDB.password;

            const tokenID = employeeDB.token_id;           
            
            let newToken = jsonWebToken.sign({user: employeeDB}, process.env.SECRET, {expiresIn: process.env.TOKEN_EXPIRATION});     
            return await updateToken(res, String(tokenID), newToken, Number(process.env.TOKEN_EXPIRATION));
        });
    });
} 


async function updateToken(res: Response, tokenID: String, newToken: string, expiresIn: Number) {
    let token = new TokenModel();
    token.token_key = newToken;
    token.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    token.expires_in = expiresIn;

    const queryUpdate = `UPDATE token SET token_key = "${token.token_key}", created_at = "${token.created_at}",  
                        expires_in = "${token.expires_in}" WHERE token_id = "${tokenID}"`;
    
    return await query(queryUpdate).then(dataUpdate => {
        if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});

        return res.status(200).json({
            ok: true,
            message: 'Token updated',
            token: newToken,
            expires_in: expiresIn
        });
    });
}
