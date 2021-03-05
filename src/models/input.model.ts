import { IInput } from '../interfaces/input.interface';

export class InputModel implements IInput{
    purchase_order_id: number;
    employee_id: number;
    input_date: string;
    notes: string;
    state: number;
}