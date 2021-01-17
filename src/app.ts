import express, { Application } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import BodyParser from 'body-parser';
import IndexRoutes from './routes/index.routes';
import AuthRoutes from './routes/auth.routes';

import StoreRoutes from './routes/store.routes';
import CategoryRoutes from './routes/category.routes';
import ProviderRoutes from './routes/provider.routes';
import CommodityRoutes from './routes/commodity.routes';
import EnvironmentRoutes from './routes/environment.routes';
import EmployeeRoutes from './routes/employee.routes';
import StoreCommodityRoutes from './routes/store_commodity.routes';

import { tokenValidation } from './middlewares/authentication';

export class App {
    private app: Application;
    private port: number | string;

    constructor(port?: number | string) {
        this.app = express();
        this.port = port;

        dotenv.config();

        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    } 

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(BodyParser.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
    }

    public async listen() {
        await this.app.listen(this.app.get('port'), '0.0.0.0');
        console.log('Server on port', this.app.get('port'));
    }

    routes() {
        this.app.use(IndexRoutes);
        this.app.use('/auth', AuthRoutes);
        this.app.use('/store', StoreRoutes);
        this.app.use('/category', CategoryRoutes);
        this.app.use('/commodity', CommodityRoutes);
        this.app.use('/provider', ProviderRoutes);
        this.app.use('/environment', EnvironmentRoutes);
        this.app.use('/employee', EmployeeRoutes);
        this.app.use('/store_commodity', StoreCommodityRoutes);
    }
}