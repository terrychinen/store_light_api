import { IEmployee } from '../interfaces/employee.interface';

export class EmployeeModel implements IEmployee{
    employee_id?: number;
    token_id?: number;
    name: string;
    username: string;
    password: string;
    state: number;
 
}