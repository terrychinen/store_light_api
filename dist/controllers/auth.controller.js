"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.signIn = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var moment_1 = __importDefault(require("moment"));
var query_1 = require("../query/query");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var token_model_1 = require("../models/token.model");
var token_controller_1 = require("./token.controller");
var employee_model_1 = require("../models/employee.model");
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, queryGet;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (body.username == null || body.password == null) {
                        return [2 /*return*/, res.status(404).json({
                                ok: false,
                                message: "La variable 'username' y 'password' son obligatorios!"
                            })];
                    }
                    queryGet = "SELECT * FROM employee WHERE username = \"" + body.username + "\"";
                    return [4 /*yield*/, query_1.query(queryGet).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var employeeDB_1, compare, token_1, e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        if (!data.ok)
                                            return [2 /*return*/, res.status(data.status).json({ ok: false, message: data.message })];
                                        employeeDB_1 = data.result[0][0];
                                        if (employeeDB_1 == null) {
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: 'El usuario o la contraseña es incorrecto' })];
                                        }
                                        return [4 /*yield*/, bcrypt_1.default.compareSync(body.password, employeeDB_1.password)];
                                    case 1:
                                        compare = _a.sent();
                                        if (!compare)
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: 'El usuario o la contraseña es incorrecto' })];
                                        if (employeeDB_1.state == 0) {
                                            return [2 /*return*/, res.status(403).json({ ok: false, message: 'Cuenta eliminado' })];
                                        }
                                        delete employeeDB_1.password;
                                        token_1 = jsonwebtoken_1.default.sign({ user: employeeDB_1 }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
                                        return [2 /*return*/, token_controller_1.updateNewToken(employeeDB_1, token_1).then(function (data) {
                                                if (!data.ok)
                                                    return res.status(400).json({ ok: false, message: data.message });
                                                return res.status(200).json({
                                                    ok: true,
                                                    message: 'Inicio de sesión correcto!',
                                                    user: employeeDB_1,
                                                    token: token_1,
                                                    expires_in: process.env.TOKEN_EXPIRATION,
                                                    date: moment_1.default().format('YYYY-MM-DD HH:mm:ss')
                                                });
                                            })];
                                    case 2:
                                        e_1 = _a.sent();
                                        return [2 /*return*/, res.status(400).json({
                                                ok: false,
                                                message: e_1.toString()
                                            })];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.signIn = signIn;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var employee_1, queryCheck, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    employee_1 = req.body;
                    if (employee_1.name == null || employee_1.username == null || employee_1.password == null || employee_1.state == null) {
                        return [2 /*return*/, res.status(404).json({
                                ok: false,
                                message: "La variable 'name', 'username' 'password' y 'state' son obligatorio!"
                            })];
                    }
                    queryCheck = "SELECT * FROM employee WHERE username = \"" + employee_1.username + "\"";
                    return [4 /*yield*/, query_1.query(queryCheck).then(function (dataCheck) { return __awaiter(_this, void 0, void 0, function () {
                            var employeeDB, password, createEmployeeQuery;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!dataCheck.ok) {
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: dataCheck.message })];
                                        }
                                        employeeDB = dataCheck.result[0][0];
                                        if (employeeDB != null) {
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: 'El nombre de usuario ya existe' })];
                                        }
                                        return [4 /*yield*/, bcrypt_1.default.hashSync(employee_1.password, 10)];
                                    case 1:
                                        password = _a.sent();
                                        createEmployeeQuery = "INSERT INTO employee (name, username, password, state) \n                                        VALUES ('" + employee_1.name + "', '" + employee_1.username + "', '" + password + "', \n                                        '" + employee_1.state + "')";
                                        return [4 /*yield*/, query_1.query(createEmployeeQuery).then(function (createDataEmployee) { return __awaiter(_this, void 0, void 0, function () {
                                                var employeeID, newEmployee, jwt, token;
                                                return __generator(this, function (_a) {
                                                    if (!createDataEmployee.ok)
                                                        return [2 /*return*/, res.status(createDataEmployee.status).json({ ok: false, message: createDataEmployee.message })];
                                                    employeeID = createDataEmployee.result[0].insertId;
                                                    newEmployee = new employee_model_1.EmployeeModel();
                                                    newEmployee.employee_id = employeeID;
                                                    newEmployee.username = employee_1.username;
                                                    jwt = jsonwebtoken_1.default.sign({
                                                        user: newEmployee
                                                    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
                                                    token = new token_model_1.TokenModel();
                                                    token.token_key = jwt;
                                                    token.created_at = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
                                                    token.expires_in = Number(process.env.TOKEN_EXPIRATION);
                                                    return [2 /*return*/, token_controller_1.createNewToken(req, res, token, newEmployee.employee_id)];
                                                });
                                            }); })];
                                    case 2: 
                                    //EJECUTAMOS LA CONSULTA PARA CREAR EL EMPLEADO
                                    return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 1: 
                //VERIFICAMOS SI EL NOMBRE DEL USUARIO EXISTE
                return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, res.status(500).json({
                            ok: false,
                            message: 'Internal Server error (Crear usuario)'
                        })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.signUp = signUp;
