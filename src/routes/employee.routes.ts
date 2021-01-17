import { Router } from 'express';
import { getEmployees, createEmployee, updateEmployee } from '../controllers/employee.controller';

const router = Router();


router.route('/')
    .get(getEmployees)
    .post(createEmployee);


router.route('/:employee_id')
    .put(updateEmployee);


export default router;