import { IProvider } from '../interfaces/provider.interface';

export class ProviderModel implements IProvider {
    provider_id?: number;
    name: string;
    ruc: string;
    address: string;
    phone: string;
    state: number;
}