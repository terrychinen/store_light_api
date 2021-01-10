import { IEnvironment } from '../interfaces/environment.interface';

export class EnvironmentModel implements IEnvironment{
    environment_id?: number;
    name: string;
    state: number;
}