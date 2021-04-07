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
        const getQuery = `SELECT i.purchase_order_id, i.employee_id, 
        (e.username)employee_name, i.input_date, i.notes, po.provider_id,
        (p.name)provider_name, i.state FROM input i 
        INNER JOIN employee e ON e.employee_id = i.employee_id
        INNER JOIN purchase_order po ON po.purchase_order_id = i.purchase_order_id
        INNER JOIN provider p ON p.provider_id = po.provider_id
        WHERE i.state = ${state} ORDER BY i.input_date DESC LIMIT 200`;        

        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
           
            for(let i=0; i<data.result[0].length; i++) {
                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
            }
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        console.log(error);
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


//================== OBTENER ENTRADA POR EL ID ==================//
export async function getInput(req: Request, res: Response) {
    const purchaseOrderID = req.params.purchase_id;    

    if(Number.isNaN(purchaseOrderID)) return res.status(404).json({ok: false, 
        message: `La variable 'purchaseOrderID' son obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id FROM input WHERE
            purchase_order_id = ${purchaseOrderID} LIMIT 1`;
        
        return await query(getQuery).then(data => {
            if(!data.ok) {
                console.log(data.message);                
                return res.status(data.status).json({ok: false, message: data.message});
            }

            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        console.log(error);
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



//================== CREAR UNA ENTRADA ==================//
export async function createInputPhone(req: Request, res: Response) {
    const body = req.body;
    const input: InputModel = body;

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
            if(!createInputData.ok) {
                console.log(createInputData.message);                                                
                return res.status(createInputData.status).json({ok: false, message: createInputData.message});
            }

            return res.status(200).json({ok: true, message: 'Entrada creado correctamente'});           
        });       
    
    }catch(error) {
        console.log(error);
        return res.status(500).json({ok: false, message: error});
    }   
}


//================== CREAR UNA ENTRADA ==================//
export async function createInputDetailPhone(req: Request, res: Response) {
    const body = req.body;

    try {
        if(Number.isNaN(body.purchase_order_id)) {            
            return res.status(404).json({
                ok: false, 
                message: `La variable 'purchase_order_id' es obligatorio`
            });
        }
                    
        await query(`INSERT INTO input_detail (purchase_order_id, store_id, 
            commodity_id, quantity) VALUES (${body.purchase_order_id}, ${body.store_id}, 
            ${body.commodity_id}, ${body.quantity})`);

        const getStockQuery = await query(`SELECT stock FROM store_commodity WHERE 
            store_id = ${body.store_id} AND commodity_id = ${body.commodity_id}`);

        const stock: number = Number(getStockQuery.result[0][0].stock);
        const quantity: number = Number(body.quantity);
        const totalStock: number = stock + quantity; 

        await query(`UPDATE store_commodity SET stock = ${totalStock} WHERE 
                store_id = ${body.store_id} AND commodity_id = ${body.commodity_id}`);

        return res.status(200).json({ok: true, message: 'Entrada creado correctamente'});
       
    
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
            columnName = 'i.purchase_order_id';
        }else if(searchBy == 1) {
            columnName = 'i.notes';
        }else {
            columnName = 'p.name';
        }   

        const querySearch = `SELECT i.purchase_order_id, i.employee_id, 
        (e.username)employee_name, i.input_date, i.notes, po.provider_id,  
        (p.name)provider_name, i.state FROM input i 
        INNER JOIN employee e ON e.employee_id = i.employee_id
        INNER JOIN purchase_order po ON po.purchase_order_id = i.purchase_order_id
        INNER JOIN provider p ON p.provider_id = po.provider_id
        WHERE ${columnName} LIKE "%${search}%" AND state = ${state} LIMIT 20`;                

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




//================== BUSCAR ENTRADA POR MERCANCIA ==================//
export async function searchInputByCommodity(req: Request, res: Response){
    const search = req.body.search;
    const inputDate = req.body.input_date;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'search' y 'state' son obligatorio!`});

    try {        
        const querySearch = `SELECT i.purchase_order_id, i.employee_id, 
        e.username, i.input_date, i.notes, po.provider_id, 
        (p.name)provider_name, inp.commodity_id, (comm.name)commodity_name,
        inp.quantity, i.state FROM input i
        INNER JOIN employee e ON e.employee_id = i.employee_id
        INNER JOIN purchase_order po ON po.purchase_order_id = i.purchase_order_id
        INNER JOIN provider p ON p.provider_id = po.provider_id        
        INNER JOIN input_detail inp ON inp.purchase_order_id = i.purchase_order_id 
        INNER JOIN commodity comm ON comm.commodity_id = inp.commodity_id
        WHERE comm.name LIKE '%${search}%' AND i.input_date LIKE '%${inputDate}%' AND i.state = ${state}
        ORDER BY i.input_date DESC`;                

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




//================== BUSCAR ENTRADA POR ORDEN ==================//
export async function searchInputByOrder(req: Request, res: Response){
    const search = req.body.search;
    const searchBy = req.body.search_by;
    const inputDate = req.body.input_date;
    const state = Number(req.body.state);

    if(search == null || searchBy == null || Number.isNaN(state)) return res.status(404).json({ok: false, 
        message: `La variable 'search', 'search_by' y 'state' son obligatorio!`});

    try {        
        let columnName = '';

        if(searchBy == 'Pedido ID') {
            columnName = 'i.purchase_order_id';
        }else if(searchBy == 'Lote') {
            columnName = 'i.notes';
        }else {
            columnName = 'p.name';
        }   

        const querySearch = `SELECT i.purchase_order_id, i.employee_id, 
        (e.username)employee_name, i.input_date, i.notes, po.provider_id,  
        (p.name)provider_name, i.state FROM input i 
        INNER JOIN employee e ON e.employee_id = i.employee_id
        INNER JOIN purchase_order po ON po.purchase_order_id = i.purchase_order_id
        INNER JOIN provider p ON p.provider_id = po.provider_id
        WHERE ${columnName} LIKE "%${search}%" AND i.input_date LIKE '%${inputDate}%' AND i.state = ${state} LIMIT 20`;                

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
        const querySearch = `SELECT i.purchase_order_id, i.employee_id, 
        (e.username)employee_name, i.input_date, i.notes, po.provider_id, 
        (p.name)provider_name, i.state FROM input i
        INNER JOIN employee e ON e.employee_id = i.employee_id
        INNER JOIN purchase_order po ON po.purchase_order_id = i.purchase_order_id
        INNER JOIN provider p ON p.provider_id = po.provider_id  
        WHERE i.input_date LIKE "%${search}%" AND i.state = ${state} LIMIT 100`;                

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
        const getQuery = `SELECT i.purchase_order_id, i.store_id, 
        (s.name)store_name, i.commodity_id, (c.name)commodity_name, 
        i.quantity FROM input_detail i
        INNER JOIN store s ON s.store_id = i.store_id
        INNER JOIN commodity c ON c.commodity_id = i.commodity_id 
        WHERE purchase_order_id = ${purchaseOrderID} ORDER BY c.name ASC`;

        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})                        
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}



//================== OBTENER TODAS LAS ENTRADAS EN CELULAR ==================//
export async function getInputsPhone(req: Request, res: Response){
    const inputDate = req.query.input_date;

    if(inputDate == null) return res.status(404).json({ok: false, 
        message: `La variable 'inputDate' es obligatorio!`});

    try {
        const getQuery = `SELECT i.purchase_order_id, i.employee_id, 
        (e.username)employee_name, i.input_date, i.notes, po.provider_id,
        (p.name)provider_name, i.state FROM input i 
        INNER JOIN employee e ON e.employee_id = i.employee_id
        INNER JOIN purchase_order po ON po.purchase_order_id = i.purchase_order_id
        INNER JOIN provider p ON p.provider_id = po.provider_id
        WHERE i.state = 1 AND i.input_date LIKE '%${inputDate}%' ORDER BY i.input_date DESC`;        

        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
           
            for(let i=0; i<data.result[0].length; i++) {
                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
            }
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        console.log(error);
        return res.status(500).json({ok: false, message: error});
    }
}



//================== OBTENER TODOS LOS DETALLES DE LA ENTRADA POR LA FECHA ==================//
export async function getInputDetailByDate(req: Request, res: Response){
    const inputDate = req.query.input_date;
    
    if(inputDate == null) return res.status(404).json({ok: false, message: `La variable 'inputDate' es obligatorio!`});

    try {
        const getQuery = `SELECT id.purchase_order_id, i.employee_id, 
        e.username, id.store_id, (s.name)store_name, po.provider_id, 
        (p.name)provider_name, id.commodity_id, (c.name)commodity_name, 
        id.quantity, i.input_date FROM input_detail id
        INNER JOIN store s ON s.store_id = id.store_id       
        INNER JOIN commodity c ON c.commodity_id = id.commodity_id
        INNER JOIN input i ON i.purchase_order_id = id.purchase_order_id
        INNER JOIN purchase_order po ON po.purchase_order_id = id.purchase_order_id
        INNER JOIN provider p ON p.provider_id = po.provider_id   
        INNER JOIN employee e ON e.employee_id = i.employee_id 
        WHERE i.input_date LIKE "%${inputDate}%" ORDER BY i.input_date DESC`;

        return await query(getQuery).then(data => {    
            if(!data.ok) {
                console.log(data.message);                
                return res.status(data.status).json({ok: false, message: data.message});
            }

            for(let i=0; i<data.result[0].length; i++) {
                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
            }
            
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        console.log(error);    
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ELIMINAR UN DETALLE DE LA ENTRADA ==================//
export async function deleteInputDetailPhone(req: Request, res: Response) {
    const orderID = req.body.order_id;
    const storeID = req.body.store_id;
    const commodityID = req.body.commodity_id;

    const checkIdQuery = `SELECT * FROM input_detail WHERE purchase_order_id = ${orderID}`;

    try {
        return await query(checkIdQuery).then(async dataCheckId => {
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La entrada con el id ${orderID} no existe!`});

            const quantity: number = Number(dataCheckId.result[0][0].quantity);
            
            const getStockQuery = await query(`SELECT stock FROM store_commodity WHERE 
            store_id = ${storeID} AND commodity_id = ${commodityID}`);

            const stock: number = Number(getStockQuery.result[0][0].stock);
            const totalStock: number = stock - quantity; 
            
            await query(`UPDATE store_commodity SET stock = ${totalStock} WHERE 
                store_id = ${storeID} AND commodity_id = ${commodityID}`);

            const deleteQuery = `DELETE FROM input_detail WHERE purchase_order_id = ${orderID} 
                                    AND store_id = ${storeID} AND commodity_id = ${commodityID}`;
    
            return await query(deleteQuery).then(dataDelete => {
                if(!dataDelete.ok) return res.status(dataDelete.status).json({ok: false, message: dataDelete.message})
                return res.status(dataDelete.status).json({ok: true, message: 'La categoría se eliminó correctamente'});
            });
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