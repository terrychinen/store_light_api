import { IToken } from '../interfaces/token.interface';


export class TokenModel implements IToken {
    token_id?: Number;
    token_key: String;
    created_at: String;
    expires_in: Number;

}