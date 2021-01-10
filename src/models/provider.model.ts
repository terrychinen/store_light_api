import { IProvider } from '../interfaces/provider.interface';

export class ProviderModel implements IProvider {
    provider_id?: Number;
    name: string;
    state: Number;
}