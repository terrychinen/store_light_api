import { connect } from '../database';


export async function query(queryString: string) {
    try{
        const conn = connect();
        const query = await conn.query(queryString);

        await conn.end();

        if(!query) return ({ok: false, status: 400, message: 'Query error', result: []});
        return ({
            ok: true, 
            status: 200, 
            message: 'Query successful',
            result: query
        });

    }catch(e){return ({ok: false, status: 500, message: e.toString(), result: []});}
}