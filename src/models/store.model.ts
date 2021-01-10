import { IStore } from '../interfaces/store.interface';

export class StoreModel implements IStore {
    store_id?: Number;
    name: string;
    state: Number;
}