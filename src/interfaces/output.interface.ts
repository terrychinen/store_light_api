export interface IOutput {
    output_id: number;
    store_id: number;
    commodity_id: number;
    environment_id: number;
    quantity: number;
    employee_gives: number;
    employee_receives: number;
    date_output: string;
    notes: string;
    state: number;
}