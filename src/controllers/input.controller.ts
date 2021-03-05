import { query } from '../query/query';
import { Request, Response } from 'express';
import { InputModel } from '../models/input.model';
import { InputDetailModel } from '../models/input_detail.model';
import dateformat from 'dateformat';



//================== OBTENER TODAS LAS ENTRADAS ==================//
export async function getInputs(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id, employee_id, 
        (SELECT username FROM employee e WHERE e.employee_id = i.employee_id)employee_name, 
        input_date, notes, state FROM input i WHERE state = ${state} LIMIT 20`;        

        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
           
            for(let i=0; i<data.result[0].length; i++) {
                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
            }
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}

function transformDate(dateString: string): string {
    if (dateString) {
        let dateTransform = new Date(dateString);
        return dateformat(dateTransform, 'yyyy-mm-dd HH:MM:ss');
    }
    return null;
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
                .json({ok: false, message: createInputData.message});
                
    
            for(let i=0; i<detail.length; i++) {
                const commodityID = detail[i].commodity_id;
                const storeID = detail[i].store_id;
                const quantity = detail[i].quantity;


                await query(`INSERT INTO input_detail (purchase_order_id, store_id, 
                    commodity_id, quantity) VALUES (${input.purchase_order_id}, ${storeID}, 
                    ${commodityID}, ${quantity})`);                

                const getStockQuery = await query(`SELECT stock FROM store_commodity WHERE 
                    store_id = ${storeID} AND commodity_id = ${commodityID}`);

                const stock: number = Number(getStockQuery.result[0][0].stock);                   
                const totalStock: number = stock + quantity; 

                await query(`UPDATE store_commodity SET stock = ${totalStock} WHERE 
                    store_id = ${storeID} AND commodity_id = ${commodityID}`);     
            } 
            
            let updateQuery = `UPDATE purchase_order SET state_input= ${1} WHERE 
                purchase_order_id = ${input.purchase_order_id}`;

            await query(updateQuery);

            return res.status(200).json({ok: true, message: 'Entrada creado correctamente'});
    
           
        });   

       
    
    }catch(error) {
        console.log(error);        
        return res.status(500).json({ok: false, message: error});
    }   
}




//================== ACTUALIZAR UNA ENTRADA ==================//
export async function updateInput(req: Request, res: Response) {
    const input: InputModel = req.body;
    const purchaseID = req.params.purchase_id;

    const detail: any[] = req.body.detail; 

    if(Number.isNaN(purchaseID) || Number.isNaN(input.state)) return res.status(404).json({ok: false, 
        message: `La variable 'purchaseID' y 'state' son obligatorio!`});        

    try {
        const queryCheckId = `SELECT * FROM input WHERE purchase_order_id = ${purchaseID}`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La entrada con el id ${purchaseID} no existe!`});


            const updateQuery = await query(`UPDATE input SET input_date = "${input.input_date}", notes = "${input.notes}", 
                state = ${input.state} WHERE purchase_order_id = ${purchaseID}`);

            if(updateQuery.ok) {
                const getInputDetail = await query(`SELECT store_id, commodity_id, quantity FROM input_detail WHERE purchase_order_id = ${purchaseID}`);

                for(let i=0; i<getInputDetail.result[0].length; i++) {
                    const commodityID = getInputDetail.result[0][i].commodity_id;
                    const storeID = getInputDetail.result[0][i].store_id;
                    const quantity = getInputDetail.result[0][i].quantity;

                    const getStockQuery = await query(`SELECT stock FROM store_commodity WHERE 
                        store_id = ${storeID} AND commodity_id = ${commodityID}`);


                    const stock: number = Number(getStockQuery.result[0][0].stock);                   
                    const totalStock: number = stock - quantity; 

                    await query(`UPDATE store_commodity SET stock = ${totalStock} WHERE 
                        store_id = ${storeID} AND commodity_id = ${commodityID}`);


                    await query(`DELETE FROM input_detail WHERE purchase_order_id = ${purchaseID} AND 
                        store_id = ${storeID} AND commodity_id = ${commodityID}`);      
                }
              


                for(let i=0; i<detail.length; i++) {     
                    const storeID: number = detail[i].store_id;
                    const commodityID: number = detail[i].commodity_id;
                    const quantity: number = detail[i].quantity;                                    

                    await query (`INSERT INTO input_detail (purchase_order_id, store_id, 
                        commodity_id, quantity) VALUES (${input.purchase_order_id}, ${storeID}, 
                        ${commodityID}, ${quantity})`);

                    const getStockQuery = await query(`SELECT stock FROM store_commodity WHERE 
                    store_id = ${storeID} AND commodity_id = ${commodityID}`);

                    const stock: number = Number(getStockQuery.result[0][0].stock);                   
                    const totalStock: number = stock + quantity;                                     

                    await query(`UPDATE store_commodity SET stock = ${totalStock} WHERE 
                            store_id = ${storeID} AND commodity_id = ${commodityID}`);                                      
                }
                
                
                return res.status(updateQuery.status).json({ok: true, message: 'La entrada se actualizó correctamente'});

            }else {
                return res.status(updateQuery.status).json({ok: false, message: updateQuery.message});    
            }

        });

    }catch(error) {
        console.log(`${error}`);
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
export async function searchInput(req: Request, res: Response){
    const search = req.body.search;
    const searchBy = req.body.search_by;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'search' y 'state' son obligatorio!`});

    try {        
        let columnName = '';

        if(searchBy == 0) {
            columnName = 'purchase_order_id';
        }else {
            columnName = 'notes';
        }

        const querySearch = `SELECT purchase_order_id, employee_id, 
        (SELECT username FROM employee e WHERE e.employee_id = i.employee_id)employee_name, 
        input_date, notes, state FROM input i WHERE ${columnName} LIKE "%${search}%" AND state = ${state} LIMIT 20`;                

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})

            for(let i=0; i<data.result[0].length; i++) {
                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
            }

            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}



//================== BUSCAR ENTRADA ==================//
export async function searchInputByDate(req: Request, res: Response){
    const search = req.body.search;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'search' y 'state' son obligatorio!`});

    try {        
        const querySearch = `SELECT purchase_order_id, employee_id, 
        (SELECT username FROM employee e WHERE e.employee_id = i.employee_id)employee_name, 
        input_date, notes, state FROM input i WHERE input_date LIKE "%${search}%" AND state = ${state} LIMIT 50`;                

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            
            for(let i=0; i<data.result[0].length; i++) {
                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
            }

            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}



//================== OBTENER TODOS LOS DETALLES DE LA ENTRADA ==================//
export async function getInputDetail(req: Request, res: Response){
    const purchaseOrderID = req.params.purchase_id;
    const offset = Number(req.query.offset);
    
    if(Number.isNaN(offset)) return res.status(404).json({ok: false, message: `La variable 'offset' es obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id,
        store_id, (SELECT name FROM store WHERE store_id = i.store_id)store_name, 
        commodity_id, (SELECT name FROM commodity WHERE commodity_id = i.commodity_id)commodity_name, 
        quantity FROM input_detail i WHERE purchase_order_id = ${purchaseOrderID}`;

        return await query(getQuery).then(data => {    
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