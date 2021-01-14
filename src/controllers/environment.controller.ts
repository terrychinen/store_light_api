import { query } from '../query/query';
import { Request, Response } from 'express';
import { EnvironmentModel } from '../models/environment.model';


//================== OBTENER TODOS LOS AMBIENTES ==================//
export async function getEnvironments(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT * FROM environment WHERE state = ${state}`;

        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR UN AMBIENTE ==================//
export async function createEnvironment(req: Request, res: Response) {
    const environment: EnvironmentModel = req.body;

    if(environment.name == null || Number.isNaN(environment.state)) return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});

    try {
        const environmentName = environment.name;
        environment.name = environmentName.charAt(0).toUpperCase() + environmentName.slice(1);
    
        const queryCheck = `SELECT * FROM environment WHERE name = "${environment.name}"`;
       
        return await query(queryCheck).then(async dataCheck => {
            if(dataCheck.result[0][0] != null) {return res.status(400).json({ok: false, message: 'El ambiente ya existe!'});}
            const insertQuery = `INSERT INTO environment (name, state) VALUES ("${environment.name}", "${environment.state}")`;
    
            return await query(insertQuery).then(data => {
                if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
                return res.status(data.status).json({ok: true, message: 'Ambiente creado correctamente'});
            });
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ACTUALIZAR UN AMBIENTE ==================//
export async function updateEnvironment(req: Request, res: Response) {
    const environment: EnvironmentModel = req.body;
    const environmentID = req.params.environment_id;

    if(environment.name == null || Number.isNaN(environment.state)) return res.status(404).json({ok: false, message: `La variable 'environment_id', 'name' y 'state' son obligatorio!`});

    try {
        const environmentName = environment.name;
        environment.name = environmentName.charAt(0).toUpperCase() + environmentName.slice(1);

        const queryCheckId = `SELECT * FROM environment WHERE environment_id = "${environmentID}"`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `El ambiente con el id ${environmentID} no existe!`});

            const queryCheck = `SELECT * FROM environment WHERE name = "${environment.name}"`;

            return await query(queryCheck).then(async dataCheck => {
                if(!dataCheck.ok) return res.status(500).json({ok: false, message: dataCheck.message});
                if(dataCheck.result[0][0] != null) return res.status(406).json({ok: false, message: 'El ambiente ya existe!'});

                const updateQuery = `UPDATE environment SET name="${environment.name}", state = "${environment.state}" WHERE environment_id = "${environmentID}"`;    

                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                    return res.status(dataUpdate.status).json({ok: true, message: 'El ambiente se actualizó correctamente'});
                });
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}




//================== ELIMINAR UN AMBIENTE POR SU ID ==================//
export async function deleteEnvironment(req: Request, res: Response) {
    const environmentID = req.params.environment_id;

    const checkIdQuery = `SELECT * FROM environment WHERE environment_id = ${environmentID}`;

    try {
        return await query(checkIdQuery).then(async dataCheckId => {
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `El ambiente con el id ${environmentID} no existe!`});
            const deleteQuery = `DELETE FROM environment WHERE environment_id = ${environmentID}`;
    
            return await query(deleteQuery).then(dataDelete => {
                if(!dataDelete.ok) return res.status(dataDelete.status).json({ok: false, message: dataDelete.message})
                return res.status(dataDelete.status).json({ok: true, message: 'El ambiente se eliminó correctamente'});
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== BUSCAR AMBIENTE POR SU NOMBRE  ==================//
export async function searchEnvironment(req: Request, res: Response){
    const search = req.body.search;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'search' y 'state' son obligatorio!`});

    try {
        const querySearch = `SELECT * FROM environment WHERE name LIKE "%${search}%" AND state = ${state} LIMIT 10`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}