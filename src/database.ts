import { createPool, Pool } from 'mysql2/promise';


export async function connect() {
    const connection: Pool = await createPool({
        host: '0.0.0.0',
        port: 3306,
        user: 'root',
        password: process.env.DATABASE_PASSOWRD,
        database: 'store_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    
    return connection;

}