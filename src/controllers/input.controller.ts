import { query } from '../query/query';
import { Request, Response } from 'express';
import { InputModel } from '../models/input.model';
import { InputDetailModel } from '../models/input_detail.model';


//================== OBTENER TODAS LAS ENTRADAS ==================//
export async function getInputs(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id, employee_id, 
        (SELECT username FROM employee WHERE employee_id = i.employee_id)username, 
        input_date, notes, state FROM input i WHERE state = ${state} LIMIT 20`;        

        
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

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'offset' y 'state' son obligatorio!`});

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



//================== CREAR UNA ENTRADA ==================//
export async function createInput(req: Request, res: Response) {
    const body = req.body;
    const input: InputModel = body;
    const inputDetail: InputDetailModel = body;
    
    const detail: any[] = body.detail;

    try {
        if(Number.isNaN(input.employee_id) || Number.isNaN(input.purchase_order_id) || 
        input.input_date == null || input.notes == null || 
        Number.isNaN(input.state)) return res.status(404).json({ok: false, 
            message: `La variable 'employee_id', 'pruchase_order_id', 'input_date', 
                'notes' y 'state' son obligatorios!`});

        await checkIfEmployeeAndPurchaseOrderExists(res, input.purchase_order_id, input.employee_id);
  
        let insertInput = `INSERT INTO input (purchase_order_id, employee_id, input_date, notes, state) 
                VALUES (${input.purchase_order_id}, ${input.employee_id}, 
                "${input.input_date}", "${input.notes}", ${input.state})`;

         return await query(insertInput).then(async createInputData => {
            if(!createInputData.ok) return res.status(createInputData.status)
                .json({ok: false, message: createInputData.message})

            const inputID = createInputData.result[0].insertId;
    
            for(let i=0; i<detail.length; i++) {

                const insertInputDetail = `INSERT INTO input_detail (input_id, store_id, commodity_id, quantity) 
                VALUES (${inputID}, ${detail[i].store_id}, ${detail[i].commodity_id}, ${detail[i].quantity})`;

                await query(insertInputDetail);  
            }   

            return res.status(200).json({ok: true, message: 'Entrada creado correctamente'});
    
           
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

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'search' y 'state' son obligatorio!`});

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




async function checkIfEmployeeAndPurchaseOrderExists(res: Response, purchaseOrderID: Number, employeeID: Number) {
    let checkIfPurchaseOrderExists = (await query(`SELECT * FROM purchase_order WHERE 
        purchase_order_id = ${purchaseOrderID}`)).result;

    if(checkIfPurchaseOrderExists[0][0] == null) {
        return res.status(400).json({ok: false, message: 'No existe el ID del órden de pedido'});
    }

    let checkIfEmployeeExists = (await query(`SELECT * FROM employee WHERE employee_id = ${employeeID}`)).result;
    if(checkIfEmployeeExists[0][0] == null) {
        return res.status(400).json({ok: false, message: 'No existe el ID del empleado'});
    }
}