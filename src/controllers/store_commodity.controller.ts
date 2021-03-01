import { query } from '../query/query';
import { NextFunction, Request, Response } from 'express';
import { StoreCommodityModel } from '../models/store_commodity.model';


//================== OBTENER TODAS LOS ALMACENES-MERCANCIAS ==================//
export async function getStoresCommodities(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT sc.store_id, (s.name)store_name, sc.commodity_id, (c.name)commodity_name, 
            sc.stock, sc.stock_min,
		    (SELECT SUM(stock) FROM store_commodity WHERE commodity_id = sc.commodity_id)stock_total,
            sc.state FROM store_commodity sc
            INNER JOIN store s ON s.store_id = sc.store_id
            INNER JOIN commodity c ON c.commodity_id = sc.commodity_id
            ORDER BY s.name ASC, c.name ASC`;
        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR ALMACENES-MERCANCIAS ==================//
export async function createStoreCommodity(req: Request, res: Response, next: NextFunction) {
    const storeCommodity: StoreCommodityModel = req.body;

    try{       

        if(Number.isNaN(storeCommodity.store_id) || Number.isNaN(storeCommodity.commodity_id) || 
        Number.isNaN(storeCommodity.stock) || Number.isNaN(storeCommodity.state)) return res.status(404).json({ok: false, message: `La variable 'store_id', 'commodity_id', 'stock' y 'state' son obligatorio!`});

        await checkIfCommodityAndStoreExists(res, storeCommodity.commodity_id, storeCommodity.store_id);
    
        let checkIfCommodity_StoreExists = (await query(`SELECT * FROM store_commodity 
                    WHERE store_id = ${storeCommodity.store_id} AND commodity_id = ${storeCommodity.commodity_id}`)).result;
               
        if(checkIfCommodity_StoreExists[0][0] == null) {
            const insertQuery = `INSERT INTO store_commodity (store_id, commodity_id, stock, stock_min, state) VALUES 
                 (${storeCommodity.store_id}, ${storeCommodity.commodity_id},  
                     ${storeCommodity.stock}, ${storeCommodity.stock_min}, ${storeCommodity.state})`;
    
            await query(insertQuery).then(data => {
                if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            });

        }else{
            return res.status(400).json({ok: false, message: 'Ya existe esa asociación'});
        }

    return res.status(200).json({ok: true, message: 'Se creó correctamente la asociación'});
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}
    
    

//================== ACTUALIZAR ALMACENES-MERCANCIAS ==================//
export async function updateStoreCommodity(req: Request, res: Response) {
    const storeCommodity: StoreCommodityModel = req.body;

    if(Number.isNaN(storeCommodity.store_id) || Number.isNaN(storeCommodity.commodity_id) || 
    Number.isNaN(storeCommodity.stock) || Number.isNaN(storeCommodity.state)) return res.status(404).json({ok: false, message: `La variable 'store_id', 'commodity_id', 'stock' y 'state' son obligatorio!`});


    try {

        await checkIfCommodityAndStoreExists(res, storeCommodity.commodity_id, storeCommodity.store_id);
    
        const updateQuery = `UPDATE store_commodity SET stock = ${storeCommodity.stock}, 
            stock_min = ${storeCommodity.stock_min}, state = ${storeCommodity.state} WHERE 
            store_id = ${storeCommodity.store_id} AND 
            commodity_id = ${storeCommodity.commodity_id}`;    
    
        return await query(updateQuery).then(async dataUpdate => {
            if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
            return res.status(dataUpdate.status).json({ok: true, message: 'La asociación se actualizó correctamente'});     
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}


//================== OBTENER TODAS LAS MERCANCIAS POR EL ID DEL ALMACEN ==================//
export async function getCommoditiesByStoreID(req: Request, res: Response){
    const storeID = Number(req.params.store_id);
    const search = req.body.search;
    const offset = Number(req.body.offset);
    const state = Number(req.body.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT sc.commodity_id, (c.name)commodity_name, sc.stock, sc.stock_min, sc.state FROM store_commodity sc 
            INNER JOIN commodity c ON c.commodity_id = sc.commodity_id WHERE store_id = ${storeID} 
            AND c.name LIKE '%${search}%' LIMIT 10`;
        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})                                
            
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}
   


//================== OBTENER TODAS LAS MERCANCIAS POR EL ID DEL ALMACEN Y DEL ID DE LA MERCANCIA==================//
export async function getCommodityByStoreIDAndCommdotyId(req: Request, res: Response){
    const storeID = Number(req.params.store_id);
    const commodityID = Number(req.params.commodity_id);

    try {
        const getQuery = `SELECT stock FROM store_commodity WHERE store_id = ${storeID} AND commodity_id = ${commodityID} LIMIT 1`;
        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})                                
            
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
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