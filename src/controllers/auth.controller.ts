import bcrypt from 'bcrypt';
import moment from 'moment';
import { query } from '../query/query';
import jsonWebToken from 'jsonwebtoken';
import { Request, Response } from 'express';
import { TokenModel } from '../models/token.model';
import { createNewToken, updateNewToken } from './token.controller';
import { EmployeeModel } from '../models/employee.model';



export async function signIn(req: Request, res: Response) {
    const body = req.body;

    if(body.username == null || body.password == null) {
        return res.status(404).json({
            ok: false, 
            message: `La variable 'username' y 'password' son obligatorios!`
        });
    } 

    const queryGet = `SELECT * FROM employee WHERE username = "${body.username}"`;    

    return await query(queryGet).then( async data => {
        try{
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})

            const employeeDB: EmployeeModel = data.result[0][0];


            if(employeeDB == null) {return res.status(400).json({ok: false, message: 'El usuario o la contraseña es incorrecto'});}
    
            const compare = await bcrypt.compareSync(body.password, employeeDB.password);
            if(!compare) return res.status(400).json({ok:false, message: 'El usuario o la contraseña es incorrecto'});
    
            if(employeeDB.state == 0){return res.status(403).json({ok: false, message: 'Cuenta eliminado'});}
    
            delete employeeDB.password;
    
            let token = jsonWebToken.sign({user: employeeDB}, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRATION}); 

            let expiresIn = Number(process.env.TOKEN_EXPIRATION);
    
            return updateNewToken(employeeDB, token).then(data => {
                if(!data.ok) return res.status(400).json({ok: false, message: data.message})
                return res.status(200).json({
                    ok: true,
                    message: 'Inicio de sesión correcto!',
                    user: employeeDB,
                    token,
                    expires_in: expiresIn,
                    date: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            });   
        }catch(e){
            return res.status(400).json({
                ok: false,
                message: e.toString()
            });
        }
    });      
}


export async function signUp(req: Request, res: Response) {
    try{
        console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAa');
        const employee: EmployeeModel = req.body;

        if(employee.name == null || employee.username == null || employee.password == null || employee.state == null) {
            return res.status(404).json({
                ok: false, 
                message: `La variable 'name', 'username' 'password' y 'state' son obligatorio!`
            });
        } 

        console.log('DOSSSSSSSSSSSSSSSSSSSSSSSSsss');
        const queryCheck = `SELECT * FROM employee WHERE username = "${employee.username}"`;
        
        //VERIFICAMOS SI EL NOMBRE DEL USUARIO EXISTE
        return await query(queryCheck).then(async dataCheck => {
            if(!dataCheck.ok) {return res.status(400).json({ok: false, message: dataCheck.message});}

            console.log('DOEREFERFERFEFERFE');
            const employeeDB: EmployeeModel = dataCheck.result[0][0];

            if(employeeDB != null) {return res.status(400).json({ok: false, message: 'El nombre de usuario ya existe'});}

            let password = await bcrypt.hashSync(employee.password, 10);

            const createEmployeeQuery = `INSERT INTO employee (name, username, password, state) 
                                        VALUES ('${employee.name}', '${employee.username}', '${password}', 
                                        '${employee.state}')`;


            //EJECUTAMOS LA CONSULTA PARA CREAR EL EMPLEADO
            return await query(createEmployeeQuery).then(async createDataEmployee => {
                if(!createDataEmployee.ok) return res.status(createDataEmployee.status).json({ok: false, message: createDataEmployee.message});

                //OBTENEMOS EL ULTIMO ID DEL INSERT DEL EMPLEADO
                const employeeID = createDataEmployee.result[0].insertId;

                const newEmployee = new EmployeeModel();
                newEmployee.employee_id = employeeID;
                newEmployee.username = employee.username;

                //FIRMAMOS EL TOKEN
                let jwt = jsonWebToken.sign({
                    user: newEmployee
                }, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRATION});


                let token = new TokenModel();
                token.token_key = jwt;
                token.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
                token.expires_in = Number(process.env.TOKEN_EXPIRATION);
                
                return createNewToken(req, res, token, newEmployee.employee_id);
            });
        });    
    }catch(error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Internal Server error (Crear usuario)' 
        });
    }
}