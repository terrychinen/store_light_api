import { query } from '../query/query';
import { Request, Response } from 'express';
import { PurchaseOrderModel } from '../models/purchase_order.model';
import dateformat from 'dateformat';


//================== OBTENER TODOS LOS ORDENES DE PEDIDOS ==================//
export async function getPurchaseOrders(req: Request, res: Response){
    const offset = Number(req.query.offset);

    if(Number.isNaN(offset)) return res.status(404).json({ok: false, message: `La variable 'offset' es obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id, provider_id, 
        (SELECT name FROM provider WHERE provider_id = po.provider_id)provider_name, 
        employee_id, (SELECT username FROM employee WHERE employee_id = po.employee_id)employee_name, 
        order_date, waiting_date, expected_date, receive_date, paid_date, cancel_date, total_price, message, updated_by, 
        (SELECT name FROM employee WHERE employee_id = po.updated_by)updated_name,
        state FROM purchase_order po ORDER BY state ASC, order_date DESC LIMIT 20`;

        return await query(getQuery).then(data => {
            for(let i=0; i<data.result[0].length; i++) {                                                          
                data.result[0][i].order_date = transformDate(data.result[0][i].order_date);
                data.result[0][i].expected_date = transformDate(data.result[0][i].expected_date); 
                data.result[0][i].receive_date = transformDate(data.result[0][i].receive_date); 
                data.result[0][i].paid_date = transformDate(data.result[0][i].paid_date);
            } 
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
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


//================== OBTENER TODOS LOS DETALLES DEL ORDEN DE PEDIDO ==================//
export async function getPurchaseOrderDetail(req: Request, res: Response){
    const purchaseOrderID = req.params.purchase_id;
    const offset = Number(req.query.offset);
    
  //  const state = Number(req.query.state);

    if(Number.isNaN(offset)) return res.status(404).json({ok: false, message: `La variable 'offset' es obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id, commodity_id, 
        (SELECT name FROM commodity WHERE commodity_id = pod.commodity_id)name, 
        quantity, unit_price, total_price FROM purchase_order_detail pod WHERE purchase_order_id = ${purchaseOrderID}`;

        return await query(getQuery).then(data => {    
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}


//================== CREAR UN ORDEN DE PEDIDO ==================//
export async function createPurchaseOrder(req: Request, res: Response) {
    const body = req.body;
    const purchaseOrder: PurchaseOrderModel = body;
    
    const detail: any[] = body.detail;

    try {
        if(purchaseOrder.provider_id == null || Number.isNaN(purchaseOrder.employee_id) || 
        purchaseOrder.order_date == null || purchaseOrder.total_price == null || 
        Number.isNaN(purchaseOrder.state)) return res.status(404).json({ok: false, message: `La variable 'provider_id', 'employee_id', 'order_date', 'total_price' y 'state' son obligatorios!`});

        await checkIfProviderAndEmployeeExists(res, purchaseOrder.provider_id, purchaseOrder.employee_id);

        let insertOrder = '';
  
        insertOrder = `INSERT INTO purchase_order (provider_id, employee_id, order_date, waiting_date, expected_date, 
            receive_date, paid_date, cancel_date, total_price, message, state) VALUES (${purchaseOrder.provider_id}, ${purchaseOrder.employee_id}, 
                "${purchaseOrder.order_date}", NULLIF('${purchaseOrder.waiting_date}', 'null'),
                NULLIF('${purchaseOrder.expected_date}', 'null'), NULLIF('${purchaseOrder.receive_date}', 'null'), 
                NULLIF('${purchaseOrder.paid_date}', 'null'), NULLIF('${purchaseOrder.cancel_date}', 'null'), 
                ${purchaseOrder.total_price}, "${purchaseOrder.message}", ${purchaseOrder.state})`;


         return await query(insertOrder).then(async createOrderData => {
            if(!createOrderData.ok) {console.log(createOrderData.message); return res.status(createOrderData.status).json({ok: false, message: createOrderData.message});}

            const purchaseOrderID = createOrderData.result[0].insertId;
    
            for(let i=0; i<detail.length; i++) {

                const insertOrderDetail = `INSERT INTO purchase_order_detail (purchase_order_id, commodity_id, quantity, unit_price, 
                    total_price) VALUES (${purchaseOrderID}, ${detail[i].commodity_id}, ${detail[i].quantity}, 
                            ${detail[i].unit_price}, ${detail[i].commodity_total_price})`;

                await query(insertOrderDetail);  
            }   

            return res.status(200).json({ok: true, message: 'Órden de pedido creado correctamente'});
    
           
        });   

       
    
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   

}



//================== ACTUALIZAR UN ORDEN DE PEDIDO ==================//
export async function updatePurchaseOrder(req: Request, res: Response) {
    const body = req.body;
    const purchaseOrder: PurchaseOrderModel = body;    
    const purchaseOrderID = req.params.purchase_id;

    const detail: any[] = body.detail;  


    const orderDate: string = purchaseOrder.order_date;


    console.log(purchaseOrder.order_date);

    if(purchaseOrder.provider_id == null || Number.isNaN(purchaseOrder.employee_id) || 
        purchaseOrder.order_date == null || purchaseOrder.total_price == null || 
        Number.isNaN(purchaseOrder.state)) 
        return res.status(404).json({
            ok: false, message: `La variable 'provider_id', 'employee_id', 'order_date', 'total_price' y 'state' son obligatorios!`
        });                


    try {    
        await checkIfProviderAndEmployeeExists(res, purchaseOrder.provider_id, purchaseOrder.updated_by);
        
        let updateQuery = `UPDATE purchase_order SET provider_id=${purchaseOrder.provider_id}, 
            order_date = NULLIF('${purchaseOrder.order_date}', 'null'), 
            waiting_date = NULLIF('${purchaseOrder.waiting_date}', 'null'), 
            expected_date = NULLIF('${purchaseOrder.expected_date}', 'null'), 
            receive_date = NULLIF('${purchaseOrder.receive_date}', 'null'), 
            paid_date= NULLIF('${purchaseOrder.paid_date}', 'null'), 
            cancel_date =  NULLIF('${purchaseOrder.cancel_date}', 'null'), 
            total_price=${purchaseOrder.total_price}, updated_by=${purchaseOrder.updated_by}, 
            message = '${purchaseOrder.message}', state=${purchaseOrder.state} WHERE purchase_order_id = ${purchaseOrderID}`;       
    
        return await query(updateQuery).then(async data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message});

            console.log(purchaseOrder.order_date);

           const deleteQuery = `DELETE FROM purchase_order_detail WHERE purchase_order_id = ${purchaseOrderID}`;                
           await query(deleteQuery);
            
            
            for(let i=0; i<detail.length; i++) {     
                
                console.log("commodity id: " +detail[i].commodity_id);
                console.log("quantity: " +detail[i].quantity);
                
              
                const insertOrderDetail = `INSERT INTO purchase_order_detail (purchase_order_id, commodity_id, quantity, unit_price, 
                    total_price) VALUES (${purchaseOrderID}, ${detail[i].commodity_id}, ${detail[i].quantity}, 
                            ${detail[i].unit_price}, ${detail[i].commodity_total_price})`;

                await query(insertOrderDetail);                    
                
            }            

            return res.status(data.status).json({ok: true, message: 'El órden de pedido se actualizó correctamente'});
        });
    }catch(error) {
        console.log(error);
        return res.status(500).json({ok: false, message: error});
    }
}



async function checkIfProviderAndEmployeeExists(res: Response, providerID: Number, employeeID: Number) {
    let checkIfProviderExists = (await query(`SELECT * FROM provider WHERE provider_id = ${providerID}`)).result;
    if(checkIfProviderExists[0][0] == null) {
        return res.status(400).json({ok: false, message: 'No existe el ID del proveedor'});
    }

    let checkIfEmployeeExists = (await query(`SELECT * FROM employee WHERE employee_id = ${employeeID}`)).result;
    if(checkIfEmployeeExists[0][0] == null) {
        return res.status(400).json({ok: false, message: 'No existe el ID del empleado'});
    }
}



export async function getPurchaseOrdersWithState(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset)) return res.status(404).json({ok: false, message: `La variable 'offset' es obligatorio!`});

    try {
        const getQuery = `SELECT purchase_order_id, provider_id, 
        (SELECT name FROM provider WHERE provider_id = po.provider_id)provider_name, 
        employee_id, (SELECT username FROM employee WHERE employee_id = po.employee_id)employee_name, 
        order_date, expected_date, receive_date, paid_date, cancel_date, total_price, message, updated_by, 
        (SELECT name FROM employee WHERE employee_id = po.updated_by)updated_name,
        state FROM purchase_order po WHERE state = ${state} ORDER BY order_date DESC LIMIT 20`;

        return await query(getQuery).then(data => {
            for(var i=0; i<data.result[0].length; i++) {                                                          
                data.result[0][i].order_date = transformDate(data.result[0][i].order_date);
                data.result[0][i].expected_date = transformDate(data.result[0][i].expected_date); 
                data.result[0][i].receive_date = transformDate(data.result[0][i].receive_date); 
                data.result[0][i].paid_date = transformDate(data.result[0][i].paid_date);
            }
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}