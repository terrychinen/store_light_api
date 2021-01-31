import { IPurchaseOrderDetail } from '../interfaces/purchase_order_detail.interface';

export class PurchaseOrderDetailModel implements IPurchaseOrderDetail {
    purchase_order_id?: number;
    commodity_id: number;
    quantity: number;
    unit_price: string;
    total_price: string;
}