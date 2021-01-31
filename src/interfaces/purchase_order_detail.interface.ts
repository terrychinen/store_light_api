export interface IPurchaseOrderDetail {
    purchase_order_id?: number;
    commodity_id: number;
    quantity: number;
    unit_price: string;
    total_price: string;
}