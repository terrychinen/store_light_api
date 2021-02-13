import { query } from '../query/query';
import { Request, Response } from 'express';
import { OutputModel } from '../models/output.model';
import dateformat from 'dateformat';


//================== OBTENER TODAS LAS SALIDAS ==================//
export async function getOutputs(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT output_id, store_id,
        (SELECT name FROM store WHERE store_id = o.store_id)store_name, commodity_id, 
        (SELECT name FROM commodity WHERE commodity_id = o.commodity_id)commodity_name, environment_id,
        (SELECT name FROM environment WHERE environment_id = o.environment_id)environment_name,    
        employee_gives, (SELECT username FROM employee WHERE employee_id = o.employee_gives)employee_gives_name, 
        employee_receives, (SELECT username FROM employee WHERE employee_id = o.employee_receives)employee_receives_name, 
        quantity, o.date_output, notes, state FROM output o WHERE state = ${state} LIMIT 20`;        
      
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})

            var outputList: OutputModel[] = data.result[0];

           for(let i=0; i<outputList.length; i++) {
                data.result[0][i].date_output = data.result[0][i].date_output.toISOString().replace(/T/, ' ').replace(/\..+/, '');    
           }
            
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
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
    
        return await query(insertQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: 'Salida creado correctamente'});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}