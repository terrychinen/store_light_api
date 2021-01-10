import { IStore } from '../interfaces/store.interface';

export class StoreModel implements IStore {
    store_id?: number;
    name: string;
    state: number;
}