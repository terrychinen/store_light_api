import { createPool, Pool } from 'mysql2/promise';


export function connect() {
    const connection: Pool = createPool({
        host: '0.0.0.0',
        port: 3306,
        user: 'tery',
        password: 'Aka.li$$2',
        //password:'Di.ta.lux&29',
        database: 'store_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    
    return connection;

}