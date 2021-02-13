"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var index_routes_1 = __importDefault(require("./routes/index.routes"));
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var store_routes_1 = __importDefault(require("./routes/store.routes"));
var category_routes_1 = __importDefault(require("./routes/category.routes"));
var provider_routes_1 = __importDefault(require("./routes/provider.routes"));
var commodity_routes_1 = __importDefault(require("./routes/commodity.routes"));
var environment_routes_1 = __importDefault(require("./routes/environment.routes"));
var employee_routes_1 = __importDefault(require("./routes/employee.routes"));
var store_commodity_routes_1 = __importDefault(require("./routes/store_commodity.routes"));
var purchase_order_routes_1 = __importDefault(require("./routes/purchase_order.routes"));
var input_routes_1 = __importDefault(require("./routes/input.routes"));
var output_routes_1 = __importDefault(require("./routes/output.routes"));
var App = /** @class */ (function () {
    function App(port) {
        this.app = express_1.default();
        this.port = port;
        dotenv_1.default.config();
        this.settings();
        this.middlewares();
        this.routes();
    }
    App.prototype.settings = function () {
        this.app.set('port', this.port || process.env.PORT || 3000);
    };
    App.prototype.middlewares = function () {
        this.app.use(morgan_1.default('dev'));
        this.app.use(body_parser_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
    };
    App.prototype.listen = function () {
        this.app.listen(this.app.get('port'), '0.0.0.0');
        console.log('Server on port', this.app.get('port'));
    };
    App.prototype.routes = function () {
        this.app.use(index_routes_1.default);
        this.app.use('/auth', auth_routes_1.default);
        this.app.use('/store', store_routes_1.default);
        this.app.use('/category', category_routes_1.default);
        this.app.use('/commodity', commodity_routes_1.default);
        this.app.use('/provider', provider_routes_1.default);
        this.app.use('/environment', environment_routes_1.default);
        this.app.use('/employee', employee_routes_1.default);
        this.app.use('/store_commodity', store_commodity_routes_1.default);
        this.app.use('/purchase_order', purchase_order_routes_1.default);
        this.app.use('/input', input_routes_1.default);
        this.app.use('/output', output_routes_1.default);
    };
    return App;
}());
exports.App = App;
