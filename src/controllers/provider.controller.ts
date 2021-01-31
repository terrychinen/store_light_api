import { query } from '../query/query';
import { Request, Response } from 'express';
import { ProviderModel } from '../models/provider.model';


//================== OBTENER TODOS LOS PROVEEDORES ==================//
export async function getProviders(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT * FROM provider WHERE state = ${state} LIMIT 20`;

        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR UN PROVEEDOR ==================//
export async function createProvider(req: Request, res: Response) {
    const provider: ProviderModel = req.body;

    if(provider.name == null || provider.name == '' || Number.isNaN(provider.state)) 
                return res.status(404).json({ok: false,
                     message: `Las variables 'name' y 'state' son obligatorio!`});

    try {
        const providerName = provider.name;
        const providerAddress = provider.address;

        provider.name = providerName.charAt(0).toUpperCase() + providerName.slice(1);
        provider.address = providerAddress.charAt(0).toUpperCase() + providerAddress.slice(1);
    
        const queryCheck = `SELECT * FROM provider WHERE name = "${provider.name}" 
        AND address = "${provider.address}" AND phone = "${provider.phone}" AND ruc = "${provider.ruc}"`;

        return await query(queryCheck).then(async dataCheck => {
            if(dataCheck.result[0][0] != null) {return res.status(400).json({ok: false, message: 'El proveedor ya existe!'});}
            const insertQuery = `INSERT INTO provider (name, address, ruc, phone, state) VALUES ("${provider.name}", "${provider.address}", "${provider.ruc}", "${provider.phone}", "${provider.state}")`;
    
            return await query(insertQuery).then(data => {
                if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
                return res.status(data.status).json({ok: true, message: 'Proveedor creado correctamente'});
            });
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ACTUALIZAR UN PROVEEDOR ==================//
export async function updateProvider(req: Request, res: Response) {
    const provider: ProviderModel = req.body;
    const providerID = req.params.provider_id;

    if(provider.name == null || provider.name == '' || Number.isNaN(provider.state)) 
                return res.status(404).json({ok: false,
                     message: `Las variables 'name' y 'state' son obligatorio!`});
    try {
        const providerName = provider.name;
        provider.name = providerName.charAt(0).toUpperCase() + providerName.slice(1);

        const queryCheckId = `SELECT * FROM provider WHERE provider_id = "${providerID}"`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `El proveedor con el id ${providerID} no existe!`});

            const queryCheck = `SELECT * FROM provider WHERE name = "${provider.name}" 
                    AND address = "${provider.address}" AND phone = "${provider.phone}" AND ruc = "${provider.ruc}"`;

            return await query(queryCheck).then(async dataCheck => {
                if(!dataCheck.ok) return res.status(500).json({ok: false, message: dataCheck.message});
                if(dataCheck.result[0][0] != null) return res.status(406).json({ok: false, message: 'El proveedor ya existe!'});

                const updateQuery = `UPDATE provider SET name="${provider.name}", ruc="${provider.ruc}",
                        address="${provider.address}", phone="${provider.phone}", state = "${provider.state}" WHERE provider_id = "${providerID}"`;    

                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                    return res.status(dataUpdate.status).json({ok: true, message: 'El proveedor se actualizó correctamente'});
                });
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}




//================== ELIMINAR UN PROVEEDOR POR SU ID ==================//
export async function deleteProvider(req: Request, res: Response) {
    const providerID = req.params.provider_id;

    const checkIdQuery = `SELECT * FROM provider WHERE provider_id = ${providerID}`;

    try {
        return await query(checkIdQuery).then(async dataCheckId => {
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `El proveedor con el id ${providerID} no existe!`});
            const deleteQuery = `DELETE FROM provider WHERE provider_id = ${providerID}`;
    
            return await query(deleteQuery).then(dataDelete => {
                if(!dataDelete.ok) return res.status(dataDelete.status).json({ok: false, message: dataDelete.message})
                return res.status(dataDelete.status).json({ok: true, message: 'El proveedor se eliminó correctamente'});
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== BUSCAR PROVEEDOR POR SU NOMBRE  ==================//
export async function searchProvider(req: Request, res: Response){
    const search = req.body.search;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'search' y 'state' son obligatorio!`});

    try {
        const querySearch = `SELECT * FROM provider WHERE name LIKE "%${search}%" AND state = ${state} LIMIT 10`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}