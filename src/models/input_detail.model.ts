import { IInputDetail } from '../interfaces/input_detail.interface';

export class InputDetailModel implements IInputDetail{
    input_id: number;
    store_id: number;
    commodity_id: number;
    quantity: number;
}