export interface IPurchaseOrder {
    purchase_order_id?: number;
    provider_id: number;
    employee_id: number;
    order_date: string;
    expected_date: string;
    receive_date: string;
    total_price: string;
    message: string;
    updated_by: number;
    state: number;
}