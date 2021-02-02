import { query } from '../query/query';
import { Request, Response } from 'express';
import { CommodityModel } from '../models/commodity.model';


//================== OBTENER TODAS LAS MERCANCIAS ==================//
export async function getCommodities(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT comm.commodity_id, comm.category_id, (SELECT c.name FROM category c WHERE c.category_id = comm.category_id)category_name, 
              comm.name, comm.state  FROM commodity comm WHERE state = ${state} LIMIT 20`;

        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR UNA MECANCIA ==================//
export async function createCommodity(req: Request, res: Response) {
    const commodity: CommodityModel = req.body;

    if(commodity.name == null || Number.isNaN(commodity.category_id) || Number.isNaN(commodity.state)) return res.status(404).json({ok: false, message: `La variable 'name', 'category_id' y 'state' son obligatorios!`});

    try {
        const commodityName = commodity.name;
        commodity.name = commodityName.charAt(0).toUpperCase() + commodityName.slice(1);
    
        const queryCheck = `SELECT * FROM commodity WHERE name = "${commodity.name}"`;
       
        return await query(queryCheck).then(async dataCheck => {
            if(dataCheck.result[0][0] != null) {return res.status(400).json({ok: false, message: 'La mercancía ya existe!'});}
            const insertQuery = `INSERT INTO commodity (name, category_id, state) VALUES ("${commodity.name}", "${commodity.category_id}", "${commodity.state}")`;
    
            return await query(insertQuery).then(data => {
                if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
                return res.status(data.status).json({ok: true, message: 'Mercancía creado correctamente'});
            });
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ACTUALIZAR UNA MERCANCIA ==================//
export async function updateCommodity(req: Request, res: Response) {
    const commodity: CommodityModel = req.body;
    const commodityID = req.params.commodity_id;

    if(commodity.name == null || Number.isNaN(commodity.category_id) || Number.isNaN(commodity.state)) return res.status(404).json({ok: false, message: `La variable 'name', 'category_id' y 'state' son obligatorios!`});

    try {
        const commodityName = commodity.name;
        commodity.name = commodityName.charAt(0).toUpperCase() + commodityName.slice(1);

        const queryCheckId = `SELECT * FROM commodity WHERE commodity_id = "${commodityID}"`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La mercancía con el id ${commodityID} no existe!`});

            const queryCheck = `SELECT * FROM commodity WHERE name = "${commodity.name}" AND category_id = "${commodity.category_id}"`;

            return await query(queryCheck).then(async dataCheck => {
                if(!dataCheck.ok) return res.status(500).json({ok: false, message: dataCheck.message});
                if(dataCheck.result[0][0] != null) return res.status(406).json({ok: false, message: 'La mercancía ya existe!'});

                const updateQuery = `UPDATE commodity SET name="${commodity.name}", category_id="${commodity.category_id}", state="${commodity.state}" WHERE commodity_id = "${commodityID}"`;    

                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                    return res.status(dataUpdate.status).json({ok: true, message: 'La mercancía se actualizó correctamente'});
                });
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}




//================== ELIMINAR UNA MERCANCIA POR SU ID ==================//
export async function deleteCommodity(req: Request, res: Response) {
    const commodityID = req.params.commodity_id;

    const checkIdQuery = `SELECT * FROM commodity WHERE commodity_id = ${commodityID}`;

    try {
        return await query(checkIdQuery).then(async dataCheckId => {
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La mercancía con el id ${commodityID} no existe!`});
            const deleteQuery = `DELETE FROM commodity WHERE commodity_id = ${commodityID}`;
    
            return await query(deleteQuery).then(dataDelete => {
                if(!dataDelete.ok) return res.status(dataDelete.status).json({ok: false, message: dataDelete.message})
                return res.status(dataDelete.status).json({ok: true, message: 'La mercancía se eliminó correctamente'});
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== BUSCAR MERCANCIA POR SU NOMBRE  ==================//
export async function searchCommodity(req: Request, res: Response){
    const search = req.body.search;
    const searchBy = req.body.search_by;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'search' y 'state' son obligatorios!`});

    try {

        let columnName = '';

        if(searchBy == 0) {
            columnName = 'commodity_id';
        }else if(searchBy == 1) {
            columnName = 'name';
        }

        const querySearch = `SELECT commodity_id, name, category_id FROM commodity WHERE ${columnName} LIKE "%${search}%" AND state = ${state} LIMIT 10`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}