import { IToken } from '../interfaces/token.interface';


export class TokenModel implements IToken {
    token_id?: number;
    token_key: string;
    created_at: string;
    expires_in: number;

}