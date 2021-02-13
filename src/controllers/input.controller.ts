import { query } from '../query/query';
import { Request, Response } from 'express';
import { CategoryModel } from '../models/category.model';
import { InputModel } from '../models/input.model';


//================== OBTENER TODAS LAS ENTRADAS ==================//
export async function getInputs(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id, commodity_id,
        (SELECT name FROM commodity WHERE commodity_id = i.commodity_id)commodity_name,
        store_id, (SELECT name FROM store WHERE store_id = i.store_id)store_name, 
        employee_id, (SELECT username FROM employee WHERE employee_id = i.employee_id)username, 
        quantity, date, state FROM input i WHERE state = ${state} LIMIT 20`;        

        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}



export async function getReceiveOrderDetail(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id, 
        (SELECT commodity_id FROM purchase_order_detail WHERE purchase_order_id = p.purchase_order_id)commodity_id,
        (SELECT name FROM commodity WHERE commodity_id = p.commodity_id)commodity_name,
        quantity, unit_price, total_price FROM purchase_order p 
        WHERE purchase_order_id  LIMIT 20`;        

        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}

/*
input_id?: number;
    commodity_id: number;
    store_id: number;
    employee_id: number;
    quantity: number;
    date: string;
    state: number;

*/


//================== CREAR UNA ENTRADA ==================//
export async function createInput(req: Request, res: Response) {
    const input: InputModel = req.body;

    if(Number.isNaN(input.commodity_id) || Number.isNaN(input.state) || Number.isNaN(input.store_id)
        || Number.isNaN(input.quantity)) return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});

    try {        
        const insertQuery = `INSERT INTO input (purchase_order_id, commodity_id, store_id, employee_id, quantity, date, state) 
            VALUES (${input.purchase_order_id}, ${input.commodity_id}, ${input.store_id}, ${input.employee_id}, ${input.quantity}, "${input.date}", ${input.state})`;
    
        return await query(insertQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: 'Entrada creado correctamente'});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ACTUALIZAR UNA ENTRADA ==================//
export async function updateInput(req: Request, res: Response) {
    const input: InputModel = req.body;
    const inputID = req.params.input_id;

    if(Number.isNaN(inputID) || Number.isNaN(input.state)) return res.status(404).json({ok: false, message: `La variable 'category_id', 'name' y 'state' son obligatorio!`});

    try {
        const queryCheckId = `SELECT * FROM input WHERE input_id = ${inputID}`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La entrada con el id ${inputID} no existe!`});

            const updateQuery = '';

            return await query(updateQuery).then(async dataUpdate => {
                if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                return res.status(dataUpdate.status).json({ok: true, message: 'La categoría se actualizó correctamente'});
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}




//================== ELIMINAR UNA ENTRADA POR SU ID ==================//
export async function deleteCategory(req: Request, res: Response) {
    const categoryID = req.params.category_id;

    const checkIdQuery = `SELECT * FROM category WHERE category_id = ${categoryID}`;

    try {
        return await query(checkIdQuery).then(async dataCheckId => {
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La categoría con el id ${categoryID} no existe!`});
            const deleteQuery = `DELETE FROM category WHERE category_id = ${categoryID}`;
    
            return await query(deleteQuery).then(dataDelete => {
                if(!dataDelete.ok) return res.status(dataDelete.status).json({ok: false, message: dataDelete.message})
                return res.status(dataDelete.status).json({ok: true, message: 'La categoría se eliminó correctamente'});
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== BUSCAR ENTRADA ==================//
export async function searchCategory(req: Request, res: Response){
    const search = req.body.search;
    const searchBy = req.body.search_by;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'search' y 'state' son obligatorio!`});

    try {        
        let columnName = '';

        if(searchBy == 0) {
            columnName = 'category_id';
        }else {
            columnName = 'name';
        }

        const querySearch = `SELECT * FROM category WHERE ${columnName} LIKE "%${search}%" AND state = ${state} LIMIT 10`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}