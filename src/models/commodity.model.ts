import { ICommodity } from '../interfaces/commodity.interface';

export class CommodityModel implements ICommodity{
    commodity_id?: number;
    category_id?: number;
    name: string;
    state: number;
}