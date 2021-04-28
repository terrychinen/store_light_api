"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
var promise_1 = require("mysql2/promise");
function connect() {
    var connection = promise_1.createPool({
        host: '0.0.0.0',
        port: 3306,
        user: 'root',
        password: 'Aka.li$$2',
        //password:'Di.ta.lux&29',
        database: 'store_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
    return connection;
}
exports.connect = connect;
