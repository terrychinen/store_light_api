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
exports.refreshToken = exports.updateNewToken = exports.createNewToken = void 0;
var moment_1 = __importDefault(require("moment"));
var query_1 = require("../query/query");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var token_model_1 = require("../models/token.model");
function createNewToken(req, res, token, employeeID) {
    return __awaiter(this, void 0, void 0, function () {
        var createTokenQuery;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createTokenQuery = "INSERT INTO token (token_key, created_at, expires_in, state)\n    VALUES ('" + token.token_key + "', '" + token.created_at + "', '" + token.expires_in + "', '1')";
                    return [4 /*yield*/, query_1.query(createTokenQuery).then(function (createDataToken) { return __awaiter(_this, void 0, void 0, function () {
                            var tokenId, updateUserTokenQuery;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!createDataToken.ok)
                                            return [2 /*return*/, res.status(createDataToken.status).json({ ok: false, message: createDataToken.message })];
                                        tokenId = createDataToken.result[0].insertId;
                                        updateUserTokenQuery = "UPDATE employee SET token_id = " + tokenId + " \n             WHERE employee_id = " + employeeID;
                                        return [4 /*yield*/, query_1.query(updateUserTokenQuery).then(function (updateUserTokenData) {
                                                if (!updateUserTokenData.ok)
                                                    return res.status(updateUserTokenData.status).json({ ok: false, message: updateUserTokenData.message });
                                                return res.status(updateUserTokenData.status).json({ ok: true, message: 'Usuario creado satisfactoriamente' });
                                            })];
                                    case 1: 
                                    //EJECUTAMOS LA CONSULTA DE ASOCIAR EL TOKEN CON EL USUARIO CREADO      
                                    return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 1: 
                //EJECUTAMOS LA CONSULTA DE CREAR EL TOKEN
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createNewToken = createNewToken;
function updateNewToken(employee, token) {
    return __awaiter(this, void 0, void 0, function () {
        var queryString;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/, ({ ok: false, message: 'El token es obligatorio!' })];
                    queryString = "SELECT * FROM employee WHERE employee_id = " + employee.employee_id;
                    return [4 /*yield*/, query_1.query(queryString).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var dataCheck, jwt, queryUpdate;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        dataCheck = data.result[0][0];
                                        if (dataCheck == null) {
                                            return [2 /*return*/, ({ ok: false, message: 'No existe' })];
                                        }
                                        jwt = new token_model_1.TokenModel();
                                        jwt.token_key = token;
                                        jwt.created_at = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
                                        jwt.expires_in = Number(process.env.TOKEN_EXPIRATION);
                                        queryUpdate = "UPDATE token SET token_key='" + jwt.token_key + "', created_at='" + jwt.created_at + "', \n                             expires_in='" + jwt.expires_in + "' WHERE token_id = " + employee.employee_id;
                                        return [4 /*yield*/, query_1.query(queryUpdate).then(function (dataUpdate) {
                                                if (!dataUpdate.ok)
                                                    return ({ ok: false, message: dataUpdate.message });
                                                return ({ ok: dataUpdate.ok, message: 'Actualizado con exito' });
                                            })];
                                    case 1: 
                                    //GUARDA EL TOKEN
                                    return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 1: 
                //VERIFICA SI EXISTE EL USUARIO
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.updateNewToken = updateNewToken;
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, token, employeeID, queryCheckToken;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    token = body.token;
                    employeeID = body.employee_id;
                    if (!token)
                        return [2 /*return*/, res.status(406).json({ ok: false, message: 'El token es necesario!' })];
                    queryCheckToken = "SELECT * FROM token WHERE token_key = \"" + token + "\"";
                    return [4 /*yield*/, query_1.query(queryCheckToken).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var queryUser;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (data.result[0] == '')
                                            return [2 /*return*/, res.status(404).json({ ok: false, message: 'No existe el token' })];
                                        if (!data.ok)
                                            return [2 /*return*/, res.status(data.status).json({ ok: false, message: data.message })];
                                        queryUser = "SELECT * FROM employee WHERE employee_id = \"" + employeeID + "\"";
                                        return [4 /*yield*/, query_1.query(queryUser).then(function (dataUser) { return __awaiter(_this, void 0, void 0, function () {
                                                var employeeDB, tokenID, newToken;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!dataUser.ok)
                                                                return [2 /*return*/, res.status(dataUser.status).json({ ok: false, message: dataUser.message })];
                                                            if (dataUser.result[0] == '')
                                                                return [2 /*return*/, res.status(404).json({ ok: false, message: 'El usuario no existe!' })];
                                                            employeeDB = dataUser.result[0][0];
                                                            delete employeeDB.password;
                                                            tokenID = employeeDB.token_id;
                                                            newToken = jsonwebtoken_1.default.sign({ user: employeeDB }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
                                                            return [4 /*yield*/, updateToken(res, String(tokenID), newToken, Number(process.env.TOKEN_EXPIRATION))];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                });
                                            }); })];
                                    case 1: 
                                    //BUSCAMOS AL USUARIO CON SU ID
                                    return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 1: 
                //VERIFICA SI EXISTE EL TOKEN
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.refreshToken = refreshToken;
function updateToken(res, tokenID, newToken, expiresIn) {
    return __awaiter(this, void 0, void 0, function () {
        var token, queryUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = new token_model_1.TokenModel();
                    token.token_key = newToken;
                    token.created_at = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
                    token.expires_in = expiresIn;
                    queryUpdate = "UPDATE token SET token_key = \"" + token.token_key + "\", created_at = \"" + token.created_at + "\",  \n                        expires_in = \"" + token.expires_in + "\" WHERE token_id = \"" + tokenID + "\"";
                    return [4 /*yield*/, query_1.query(queryUpdate).then(function (dataUpdate) {
                            if (!dataUpdate.ok)
                                return res.status(dataUpdate.status).json({ ok: false, message: dataUpdate.message });
                            return res.status(200).json({
                                ok: true,
                                message: 'Token updated',
                                token: newToken,
                                expires_in: expiresIn
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
