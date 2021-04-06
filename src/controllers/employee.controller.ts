import bcrypt from 'bcrypt';
import { query } from '../query/query';
import { Request, Response } from 'express';
import { EmployeeModel } from '../models/employee.model';


//================== OBTENER TODAS LOS EMPLEADOS ==================//
export async function getEmployees(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT employee_id, name, username, state FROM employee WHERE state = ${state} ORDER BY username ASC`;
        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR UN EMPLEADO ==================//
export async function createEmployee(req: Request, res: Response) {
    const employee: EmployeeModel = req.body;

    if(employee.name == null || Number.isNaN(employee.state)) return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});

    try {
        const employeeName = employee.name;
        employee.name = employeeName.charAt(0).toUpperCase() + employeeName.slice(1);
    
        const queryCheck = `SELECT * FROM employee WHERE username = "${employee.username}"`;
       
        return await query(queryCheck).then(async dataCheck => {
            if(dataCheck.result[0][0] != null) {return res.status(400).json({ok: false, message: 'Ya existe un empleado con ese usuario!'});}

            let password = await bcrypt.hashSync(employee.password, 10);
            const insertQuery = `INSERT INTO employee (name, username, password, state) VALUES ("${employee.name}", "${employee.username}", "${password}", "${employee.state}")`;
    
            return await query(insertQuery).then(data => {
                if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
                return res.status(data.status).json({ok: true, message: 'Empleado creado correctamente'});
            });
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ACTUALIZAR UN EMPLEADO ==================//
export async function updateEmployee(req: Request, res: Response) {
    const employee: EmployeeModel = req.body;
    const employeeID = req.params.employee_id;

    if(employee.name == null || Number.isNaN(employee.employee_id) || Number.isNaN(employee.state)) return res.status(404).json({ok: false, message: `La variable 'employee_id', 'name' y 'state' son obligatorio!`});

    try {
        const employeeName = employee.name;
        employee.name = employeeName.charAt(0).toUpperCase() + employeeName.slice(1);

        const queryCheckId = `SELECT * FROM employee WHERE employee_id = "${employeeID}"`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `El empleado con el id ${employeeID} no existe!`});

            const queryCheck = `SELECT * FROM employee WHERE username = "${employee.username}"`;

            return await query(queryCheck).then(async dataCheck => {
                if(!dataCheck.ok) return res.status(500).json({ok: false, message: dataCheck.message});
                if(dataCheck.result[0][0] != null) return res.status(406).json({ok: false, message: 'Ya existe un empleado con ese usuario!'});

                const updateQuery = `UPDATE employee SET name="${employee.name}", username="${employee.name}", password="${employee.password}", state = "${employee.state}" WHERE employee_id = "${employeeID}"`;    

                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                    return res.status(dataUpdate.status).json({ok: true, message: 'El empleado se actualizó correctamente'});
                });
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}