import express, { Application } from 'express';
import morgan from 'morgan';
import IndexRoutes from './routes/index.routes';


export class App {
    private app: Application;
    private port: number | string;

    constructor(port?: number | string) {
        this.app = express();
        this.port = port;

        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    } 

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
    }

    public async listen() {
        await this.app.listen(this.app.get('port'), '0.0.0.0');
        console.log('Server on port', this.app.get('port'));
    }

    routes() {
        this.app.use(IndexRoutes);
    }
}