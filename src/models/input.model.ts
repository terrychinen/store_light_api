import { IInput } from '../interfaces/input.interface';

export class InputModel implements IInput{
    purchase_order_id: number;
    commodity_id: number;
    store_id: number;
    employee_id: number;
    quantity: number;
    date: string;
    state: number;

}