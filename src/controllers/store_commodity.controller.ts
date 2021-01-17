import { query } from '../query/query';
import { NextFunction, Request, Response } from 'express';
import { StoreCommodityModel } from '../models/store_commodity.model';


//================== OBTENER TODAS LOS ALMACENES-MERCANCIAS ==================//
export async function getStoresCommodities(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT sc.store_id, (SELECT name FROM store WHERE store_id = sc.store_id)store_name, 
        sc.commodity_id, (SELECT name FROM commodity WHERE commodity_id = sc.commodity_id)commodity_name, 
        sc.stock, sc.state FROM store_commodity sc WHERE sc.state = ${state}`;
        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR ALMACENES-MERCANCIAS ==================//
let checkQuery: boolean = false;
export async function createStoreCommodity(req: Request, res: Response, next: NextFunction) {
    const storeCommodityList: Array<StoreCommodityModel> = req.body.store_commodity;

    try{
        for(let i=0; i<storeCommodityList.length; i++) {
            const storeCommodity: StoreCommodityModel = storeCommodityList[i];

            await checkIfCommodityAndStoreExists(res, storeCommodity.commodity_id, storeCommodity.store_id);
    
            let checkIfCommodity_StoreExists = (await query(`SELECT * FROM store_commodity 
                    WHERE store_id = ${storeCommodity.store_id} AND commodity_id = ${storeCommodity.commodity_id}`)).result;
               

            if(checkIfCommodity_StoreExists[0][0] == null) {
                const insertQuery = `INSERT INTO store_commodity (store_id, commodity_id, stock, state) VALUES 
                 ("${storeCommodity.store_id}", "${storeCommodity.commodity_id}", 
                     "${storeCommodity.stock}", "${storeCommodity.state}")`;
    
                await query(insertQuery).then(data => {
                    if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
                });

            }else{
                return res.status(400).json({ok: false, message: 'Ya existe esa asociación'});
            }
        }

        return res.status(200).json({ok: true, message: 'Se creó correctamente la asociación'});
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}
    
    

   




async function checkIfCommodityAndStoreExists(res: Response, commodityID: Number, storeID: Number) {
    let checkIfCommodityExists = (await query(`SELECT * FROM commodity WHERE commodity_id = ${commodityID}`)).result;
    if(checkIfCommodityExists[0][0] == null) {
        return res.status(400).json({ok: false, message: 'No existe el ID de la mercancía'});
    }

    let checkIfStoreExists = (await query(`SELECT * FROM store WHERE store_id = ${storeID}`)).result;
    if(checkIfStoreExists[0][0] == null) {
        return res.status(400).json({ok: false, message: 'No existe el ID del almacén'});
    }
}


/*
//================== ACTUALIZAR ALMACENES-MERCANCIAS ==================//
export async function updateStoreCommodity(req: Request, res: Response) {
    const storeCommodity: StoreCommodityModel = req.body;

    if(Number.isNaN(storeCommodity.store_id) || Number.isNaN(storeCommodity.commodity_id) || 
    Number.isNaN(storeCommodity.stock) || Number.isNaN(storeCommodity.state)) return res.status(404).json({ok: false, message: `La variable 'store_id', 'commodity_id', 'stock' y 'state' son obligatorio!`});
    try {

        const queryCheckStoreID = `SELECT * FROM store_commodity WHERE store_id = ${storeCommodity.store_id}`;

        return await query(queryCheckStoreID).then(async dataCheckStoreId => {
            if(!dataCheckStoreId.ok) return res.status(500).json({ok: false, message: dataCheckStoreId.message});
            if(dataCheckStoreId.result[0][0] == null) return res.status(400).json({ok: false, message: `El almacén con el id ${storeCommodity.store_id} no existe!`});

            const queryCheckCommodityID = `SELECT * FROM store_commodity WHERE commodity_id = ${storeCommodity.commodity_id}`;

            return await query(queryCheckCommodityID).then(async dataCheckCommodityId => {
                if(!dataCheckCommodityId.ok) return res.status(500).json({ok: false, message: dataCheckCommodityId.message});
                if(dataCheckCommodityId.result[0][0] == null) return res.status(400).json({ok: false, message: `La mercancía con el id ${storeCommodity.commodity_id} no existe!`});

                const updateQuery = `UPDATE store_commdity SET store_id=${storeCommodity.store_id}, state = "${category.state}" WHERE category_id = "${categoryID}"`;    
    
                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                    return res.status(dataUpdate.status).json({ok: true, message: 'La categoría se actualizó correctamente'});
                });
            });           
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
} */