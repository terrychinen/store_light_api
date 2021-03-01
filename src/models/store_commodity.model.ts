import { IStoreCommodity } from '../interfaces/store_commodity.interface';

export class StoreCommodityModel implements IStoreCommodity {
    store_id?: number;
    commodity_id?: number;
    stock: number;
    stock_min: number;
    state: number;    
}