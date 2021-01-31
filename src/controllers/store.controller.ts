import { query } from '../query/query';
import { Request, Response } from 'express';
import { StoreModel } from '../models/store.model';


//================== OBTENER TODOS LOS ALMACENES ==================//
export async function getStores(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT * FROM store WHERE state = ${state} LIMIT 20`;

        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR UN ALMACEN ==================//
export async function createStore(req: Request, res: Response) {
    const store: StoreModel = req.body;

    if(store.name == null || Number.isNaN(store.state)) return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});

    try {
        const storeName = store.name;
        store.name = storeName.charAt(0).toUpperCase() + storeName.slice(1);
    
        const queryCheck = `SELECT * FROM store WHERE name = "${store.name}"`;
       
        return await query(queryCheck).then(async dataCheck => {
            if(dataCheck.result[0][0] != null) {return res.status(400).json({ok: false, message: 'El almacén ya existe!'});}
            const insertQuery = `INSERT INTO store (name, state) VALUES ("${store.name}", "${store.state}")`;
    
            return await query(insertQuery).then(data => {
                if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
                return res.status(data.status).json({ok: true, message: 'Almacén creado correctamente'});
            });
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ACTUALIZAR UN ALMACEN ==================//
export async function updateStore(req: Request, res: Response) {
    const store: StoreModel = req.body;
    const storeID = req.params.store_id;

    if(store.name == null || Number.isNaN(store.state)) return res.status(404).json({ok: false, message: `La variable 'environment_id', 'name' y 'state' son obligatorio!`});

    try {
        const storeName = store.name;
        store.name = storeName.charAt(0).toUpperCase() + storeName.slice(1);

        const queryCheckId = `SELECT * FROM store WHERE store_id = "${storeID}" LIMIT 20`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `El Almacén con el id ${storeID} no existe!`});

            const queryCheck = `SELECT * FROM store WHERE name = "${store.name}"`;

            return await query(queryCheck).then(async dataCheck => {
                if(!dataCheck.ok) return res.status(500).json({ok: false, message: dataCheck.message});
                if(dataCheck.result[0][0] != null) return res.status(406).json({ok: false, message: 'El Almacén ya existe!'});

                const updateQuery = `UPDATE store SET name="${store.name}", state = "${store.state}" WHERE store_id = "${storeID}"`;    

                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                    return res.status(dataUpdate.status).json({ok: true, message: 'El almacén se actualizó correctamente'});
                });
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}




//================== ELIMINAR UN ALMACEN POR SU ID ==================//
export async function deleteStore(req: Request, res: Response) {
    const storeID = req.params.store_id;

    const checkIdQuery = `SELECT * FROM store WHERE store_id = ${storeID}`;

    try {
        return await query(checkIdQuery).then(async dataCheckId => {
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `El almacén con el id ${storeID} no existe!`});
            const deleteQuery = `DELETE FROM store WHERE store_id = ${storeID}`;
    
            return await query(deleteQuery).then(dataDelete => {
                if(!dataDelete.ok) return res.status(dataDelete.status).json({ok: false, message: dataDelete.message})
                return res.status(dataDelete.status).json({ok: true, message: 'El almacén se eliminó correctamente'});
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== BUSCAR PROVEEDOR POR SU ALMACEN  ==================//
export async function searchStore(req: Request, res: Response){
    const search = req.body.search;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'search' y 'state' son obligatorio!`});

    try {
        const querySearch = `SELECT * FROM store WHERE name LIKE "%${search}%" AND state = ${state} LIMIT 10`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}