import { query } from '../query/query';
import { Request, Response } from 'express';
import { OutputModel } from '../models/output.model';
import dateformat from 'dateformat';



//================== OBTENER TODAS LAS SALIDAS ==================//
export async function getOutputs(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) 
        return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT output_id, store_id,
        (SELECT name FROM store WHERE store_id = o.store_id)store_name, commodity_id, 
        (SELECT name FROM commodity WHERE commodity_id = o.commodity_id)commodity_name, environment_id,
        (SELECT name FROM environment WHERE environment_id = o.environment_id)environment_name,    
        employee_gives, (SELECT username FROM employee WHERE employee_id = o.employee_gives)employee_gives_name, 
        employee_receives, (SELECT username FROM employee WHERE employee_id = o.employee_receives)employee_receives_name, 
        quantity, o.date_output, notes, state FROM output o WHERE state = ${state} ORDER BY o.date_output DESC LIMIT 200`;        
      
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})

            var outputList: OutputModel[] = data.result[0];

            for(var i=0; i<outputList.length; i++) {                                                          
                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
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


//================== CREAR UNA SALIDA ==================//
export async function createOutput(req: Request, res: Response) {
    const output: OutputModel = req.body;

    if(Number.isNaN(output.store_id) || Number.isNaN(output.commodity_id) || Number.isNaN(output.environment_id)
    || Number.isNaN(output.quantity) || Number.isNaN(output.employee_gives)
    || Number.isNaN(output.employee_receives) || output.date_output == null 
    || Number.isNaN(output.state)) return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});   
    
    try {        
        const insertQuery = `INSERT INTO output (store_id, commodity_id, environment_id, quantity, 
            employee_gives, employee_receives, date_output, notes, state) 
            VALUES (${output.store_id}, ${output.commodity_id}, ${output.environment_id}, ${output.quantity},
                    ${output.employee_gives}, ${output.employee_receives}, "${output.date_output}", "${output.notes}", ${output.state})`;

        return await query(insertQuery).then(async dataInsert => {
            if(!dataInsert.ok) return res.status(dataInsert.status).json({ok: false, message: dataInsert.message})

            const getStockQuery = await query(`SELECT stock FROM store_commodity 
            WHERE store_id = ${output.store_id} AND commodity_id = ${output.commodity_id}`);

            if(getStockQuery.result[0][0] != null) {
                const stock: number = Number(getStockQuery.result[0][0].stock);
                const quantity: number = Number(output.quantity);

                const totalStock: number = stock - quantity;

                const updateStockQuery = `UPDATE store_commodity SET stock=${totalStock} WHERE
                    store_id=${output.store_id} AND commodity_id=${output.commodity_id}`;
                    
                    return await query(updateStockQuery).then(async dataUpdate => {
                        if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message})
                        return res.status(dataInsert.status).json({ok: true, message: 'Salida creado correctamente'});          
                    });

            }

        });  


    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}



//================== ACTUALIZAR UNA SALIDA ==================//
export async function updateOutput(req: Request, res: Response) {
    const output: OutputModel = req.body;
    const outputID = req.params.output_id;

    if(Number.isNaN(output.environment_id) || Number.isNaN(output.employee_gives) 
    || Number.isNaN(output.employee_receives) || output.date_output == null || Number.isNaN(output.state)) 
        return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});  

    try {
        const updateQuery = `UPDATE output SET environment_id=${output.environment_id}, 
            employee_gives = ${output.employee_gives}, employee_receives=${output.employee_receives},
            notes = "${output.notes}", date_output = "${output.date_output}" WHERE output_id = ${outputID}`;    

        return await query(updateQuery).then(async dataUpdate => {
            if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
            return res.status(dataUpdate.status).json({ok: true, message: 'La salida se actualizó correctamente'});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}



//================== ACTUALIZAR UN STOCK ==================//
export async function updateStock(req: Request, res: Response) {
    const output: OutputModel = req.body;
    const outputID = req.params.output_id;

    if(Number.isNaN(output.quantity) || Number.isNaN(output.store_id) || Number.isNaN(output.commodity_id)) {
        return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});  
    }        

    try {
        const getStockQuery = await query(`SELECT stock FROM store_commodity 
            WHERE store_id = ${output.store_id} AND commodity_id = ${output.commodity_id}`);

        if(getStockQuery.result[0][0] != null) {
            const stock: number = Number(getStockQuery.result[0][0].stock);
            const quantity: number = Number(output.quantity);

            const totalStock: number = stock + quantity;
            
            const updateStockQuery = await query(`UPDATE store_commodity SET stock=${totalStock} WHERE 
            store_id=${output.store_id} AND commodity_id=${output.commodity_id}`);
            
            if(updateStockQuery.ok) {
                const updateOutputQuery = await query(`UPDATE output SET quantity=${req.body.left_quantity} WHERE 
                    output_id = ${outputID}`);
                    
                if(updateOutputQuery.ok) {
                    return res.status(updateStockQuery.status)
                        .json({ok: true, message: 'La salida se actualizó correctamente'});
                }else {
                    return res.status(updateOutputQuery.status)
                        .json({ok: false, message: updateOutputQuery.message});
                }               

            }

            return res.status(updateStockQuery.status).json({ok: false, message: updateStockQuery.message});            
        }
            
        return res.status(400).json({ok: true, message: 'Error de stock'});
            
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}



//================== BUSCAR SALIIDA ==================//
export async function searchOutput(req: Request, res: Response){
    const search = req.body.search;
    const searchBy = req.body.search_by;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'search' y 'state' son obligatorio!`});

    try {        
        let columnName = '';

        if(searchBy == 0) {
            columnName = 'c.name';
        }else if (searchBy == 1) {
            columnName = 'env.name';
        }else {
            columnName = 'o.date_output';
        }     

        const querySearch = `SELECT o.output_id, o.store_id, (s.name)store_name, c.commodity_id, 
            (c.name)commodity_name, o.environment_id, (env.name)environment_name, o.employee_gives,
            (emp.username)employee_gives_name, o.employee_receives, (empp.username)employee_receives_name,
            o.quantity, o.date_output, o.notes, o.state FROM output o 
            INNER JOIN store s ON s.store_id = o.store_id
            INNER JOIN commodity c ON c.commodity_id = o.commodity_id
            INNER JOIN environment env ON env.environment_id = o.environment_id
            INNER JOIN employee emp ON emp.employee_id = o.employee_gives
            INNER JOIN employee empp ON empp.employee_id = o.employee_receives
            WHERE ${columnName} LIKE "%${search}%" AND o.state = ${state} ORDER BY o.date_output DESC LIMIT 20`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message});

            var outputList: OutputModel[] = data.result[0];

            for(var i=0; i<outputList.length; i++) {                                                          
                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
            }

            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        console.log(error);
        console.log('Data: ');        
        return res.status(500).json({ok: false, message: error});
    }
}


//================== OBTENER TODAS LAS SALIDAS POR FECHA ==================//
export async function getOutputsByDate(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);
    const dateOutput = req.query.date_output;

    if(Number.isNaN(offset) || Number.isNaN(state)) 
        return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT o.output_id, o.store_id, (s.name)store_name, c.commodity_id, 
        (c.name)commodity_name, o.environment_id, (env.name)environment_name, o.employee_gives,
        (emp.username)employee_gives_name, o.employee_receives, (empp.username)employee_receives_name,
        o.quantity, o.date_output, o.notes, o.state FROM output o 
        INNER JOIN store s ON s.store_id = o.store_id
        INNER JOIN commodity c ON c.commodity_id = o.commodity_id
        INNER JOIN environment env ON env.environment_id = o.environment_id
        INNER JOIN employee emp ON emp.employee_id = o.employee_gives
        INNER JOIN employee empp ON empp.employee_id = o.employee_receives
        WHERE o.date_output LIKE "%${dateOutput}%" AND o.state = ${state} ORDER BY o.date_output DESC LIMIT 100`;        
      
        return await query(getQuery).then(data => {
            if(!data.ok) {
                console.log(data.message);                
                return res.status(data.status).json({ok: false, message: data.message});
            }

            var outputList: OutputModel[] = data.result[0];

            for(var i=0; i<outputList.length; i++) {                                                          
                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
            }
            
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        console.log(error);    
        return res.status(500).json({ok: false, message: error});
    }
}


//================== BUSCAR SALIIDA POR FECHA ==================//
export async function searchOutputByDate(req: Request, res: Response){
    const search = req.body.search;
    const dateOutput = req.body.date_output;
    const state = Number(req.body.state);

    if(Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'state' es obligatorio!`});

    try {           
        const querySearch = `SELECT o.output_id, o.store_id, (s.name)store_name, c.commodity_id, 
            (c.name)commodity_name, o.environment_id, (env.name)environment_name, o.employee_gives,
            (emp.username)employee_gives_name, o.employee_receives, (empp.username)employee_receives_name,
            o.quantity, o.date_output, o.notes, o.state FROM output o 
            INNER JOIN store s ON s.store_id = o.store_id
            INNER JOIN commodity c ON c.commodity_id = o.commodity_id
            INNER JOIN environment env ON env.environment_id = o.environment_id
            INNER JOIN employee emp ON emp.employee_id = o.employee_gives
            INNER JOIN employee empp ON empp.employee_id = o.employee_receives
            WHERE c.name LIKE "%${search}%" AND o.date_output = "${dateOutput}" AND o.state = ${state} ORDER BY o.date_output DESC LIMIT 20`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message});

            var outputList: OutputModel[] = data.result[0];

            for(var i=0; i<outputList.length; i++) {                                                          
                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
            }

            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        console.log(error);
        console.log('Data: ');        
        return res.status(500).json({ok: false, message: error});
    }
}