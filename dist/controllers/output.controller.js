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
exports.searchOutputByDate = exports.getOutputsByDate = exports.searchOutput = exports.updateStock = exports.updateOutput = exports.createOutput = exports.getOutputs = void 0;
var query_1 = require("../query/query");
var dateformat_1 = __importDefault(require("dateformat"));
//================== OBTENER TODAS LAS SALIDAS ==================//
function getOutputs(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, state, getQuery, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offset = Number(req.query.offset);
                    state = Number(req.query.state);
                    if (Number.isNaN(offset) || Number.isNaN(state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'offset' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT output_id, store_id,\n        (SELECT name FROM store WHERE store_id = o.store_id)store_name, commodity_id, \n        (SELECT name FROM commodity WHERE commodity_id = o.commodity_id)commodity_name, environment_id,\n        (SELECT name FROM environment WHERE environment_id = o.environment_id)environment_name,    \n        employee_gives, (SELECT username FROM employee WHERE employee_id = o.employee_gives)employee_gives_name, \n        employee_receives, (SELECT username FROM employee WHERE employee_id = o.employee_receives)employee_receives_name, \n        quantity, o.date_output, notes, state FROM output o WHERE state = " + state + " ORDER BY o.date_output DESC LIMIT 200";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            var outputList = data.result[0];
                            for (var i = 0; i < outputList.length; i++) {
                                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_1 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getOutputs = getOutputs;
function transformDate(dateString) {
    if (dateString) {
        var dateTransform = new Date(dateString);
        return dateformat_1.default(dateTransform, 'yyyy-mm-dd HH:MM:ss');
    }
    return null;
}
//================== CREAR UNA SALIDA ==================//
function createOutput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var output, insertQuery, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    output = req.body;
                    if (Number.isNaN(output.store_id) || Number.isNaN(output.commodity_id) || Number.isNaN(output.environment_id)
                        || Number.isNaN(output.quantity) || Number.isNaN(output.employee_gives)
                        || Number.isNaN(output.employee_receives) || output.date_output == null
                        || Number.isNaN(output.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'name' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    insertQuery = "INSERT INTO output (store_id, commodity_id, environment_id, quantity, \n            employee_gives, employee_receives, date_output, notes, state) \n            VALUES (" + output.store_id + ", " + output.commodity_id + ", " + output.environment_id + ", " + output.quantity + ",\n                    " + output.employee_gives + ", " + output.employee_receives + ", \"" + output.date_output + "\", \"" + output.notes + "\", " + output.state + ")";
                    return [4 /*yield*/, query_1.query(insertQuery).then(function (dataInsert) { return __awaiter(_this, void 0, void 0, function () {
                            var getStockQuery, stock, quantity, totalStock, updateStockQuery;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!dataInsert.ok)
                                            return [2 /*return*/, res.status(dataInsert.status).json({ ok: false, message: dataInsert.message })];
                                        return [4 /*yield*/, query_1.query("SELECT stock FROM store_commodity \n            WHERE store_id = " + output.store_id + " AND commodity_id = " + output.commodity_id)];
                                    case 1:
                                        getStockQuery = _a.sent();
                                        if (!(getStockQuery.result[0][0] != null)) return [3 /*break*/, 3];
                                        stock = Number(getStockQuery.result[0][0].stock);
                                        quantity = Number(output.quantity);
                                        totalStock = stock - quantity;
                                        updateStockQuery = "UPDATE store_commodity SET stock=" + totalStock + " WHERE\n                    store_id=" + output.store_id + " AND commodity_id=" + output.commodity_id;
                                        return [4 /*yield*/, query_1.query(updateStockQuery).then(function (dataUpdate) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    if (!dataUpdate.ok)
                                                        return [2 /*return*/, res.status(dataUpdate.status).json({ ok: false, message: dataUpdate.message })];
                                                    return [2 /*return*/, res.status(dataInsert.status).json({ ok: true, message: 'Salida creado correctamente' })];
                                                });
                                            }); })];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_2 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createOutput = createOutput;
//================== ACTUALIZAR UNA SALIDA ==================//
function updateOutput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var output, outputID, updateQuery, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    output = req.body;
                    outputID = req.params.output_id;
                    if (Number.isNaN(output.environment_id) || Number.isNaN(output.employee_gives)
                        || Number.isNaN(output.employee_receives) || output.date_output == null || Number.isNaN(output.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'name' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    updateQuery = "UPDATE output SET environment_id=" + output.environment_id + ", \n            employee_gives = " + output.employee_gives + ", employee_receives=" + output.employee_receives + ",\n            notes = \"" + output.notes + "\", date_output = \"" + output.date_output + "\" WHERE output_id = " + outputID;
                    return [4 /*yield*/, query_1.query(updateQuery).then(function (dataUpdate) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!dataUpdate.ok)
                                    return [2 /*return*/, res.status(dataUpdate.status).json({ ok: false, message: dataUpdate.message })];
                                return [2 /*return*/, res.status(dataUpdate.status).json({ ok: true, message: 'La salida se actualizó correctamente' })];
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_3 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_3 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateOutput = updateOutput;
//================== ACTUALIZAR UN STOCK ==================//
function updateStock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var output, outputID, getStockQuery, stock, quantity, totalStock, updateStockQuery, updateOutputQuery, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    output = req.body;
                    outputID = req.params.output_id;
                    if (Number.isNaN(output.quantity) || Number.isNaN(output.store_id) || Number.isNaN(output.commodity_id)) {
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'name' y 'state' son obligatorio!" })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, query_1.query("SELECT stock FROM store_commodity \n            WHERE store_id = " + output.store_id + " AND commodity_id = " + output.commodity_id)];
                case 2:
                    getStockQuery = _a.sent();
                    if (!(getStockQuery.result[0][0] != null)) return [3 /*break*/, 6];
                    stock = Number(getStockQuery.result[0][0].stock);
                    quantity = Number(output.quantity);
                    totalStock = stock + quantity;
                    return [4 /*yield*/, query_1.query("UPDATE store_commodity SET stock=" + totalStock + " WHERE \n            store_id=" + output.store_id + " AND commodity_id=" + output.commodity_id)];
                case 3:
                    updateStockQuery = _a.sent();
                    if (!updateStockQuery.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, query_1.query("UPDATE output SET quantity=" + req.body.left_quantity + " WHERE \n                    output_id = " + outputID)];
                case 4:
                    updateOutputQuery = _a.sent();
                    if (updateOutputQuery.ok) {
                        return [2 /*return*/, res.status(updateStockQuery.status)
                                .json({ ok: true, message: 'La salida se actualizó correctamente' })];
                    }
                    else {
                        return [2 /*return*/, res.status(updateOutputQuery.status)
                                .json({ ok: false, message: updateOutputQuery.message })];
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/, res.status(updateStockQuery.status).json({ ok: false, message: updateStockQuery.message })];
                case 6: return [2 /*return*/, res.status(400).json({ ok: true, message: 'Error de stock' })];
                case 7:
                    error_4 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_4 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.updateStock = updateStock;
//================== BUSCAR SALIIDA ==================//
function searchOutput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var search, searchBy, state, columnName, querySearch, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    search = req.body.search;
                    searchBy = req.body.search_by;
                    state = Number(req.body.state);
                    if (search == null || Number.isNaN(state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'search' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    columnName = '';
                    if (searchBy == 0) {
                        columnName = 'c.name';
                    }
                    else if (searchBy == 1) {
                        columnName = 'env.name';
                    }
                    else {
                        columnName = 'o.date_output';
                    }
                    querySearch = "SELECT o.output_id, o.store_id, (s.name)store_name, c.commodity_id, \n            (c.name)commodity_name, o.environment_id, (env.name)environment_name, o.employee_gives,\n            (emp.username)employee_gives_name, o.employee_receives, (empp.username)employee_receives_name,\n            o.quantity, o.date_output, o.notes, o.state FROM output o \n            INNER JOIN store s ON s.store_id = o.store_id\n            INNER JOIN commodity c ON c.commodity_id = o.commodity_id\n            INNER JOIN environment env ON env.environment_id = o.environment_id\n            INNER JOIN employee emp ON emp.employee_id = o.employee_gives\n            INNER JOIN employee empp ON empp.employee_id = o.employee_receives\n            WHERE " + columnName + " LIKE \"%" + search + "%\" AND o.state = " + state + " ORDER BY o.date_output DESC LIMIT 20";
                    return [4 /*yield*/, query_1.query(querySearch).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            var outputList = data.result[0];
                            for (var i = 0; i < outputList.length; i++) {
                                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_5 = _a.sent();
                    console.log(error_5);
                    console.log('Data: ');
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_5 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.searchOutput = searchOutput;
//================== OBTENER TODAS LAS SALIDAS POR FECHA ==================//
function getOutputsByDate(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, state, dateOutput, getQuery, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offset = Number(req.query.offset);
                    state = Number(req.query.state);
                    dateOutput = req.query.date_output;
                    if (Number.isNaN(offset) || Number.isNaN(state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'offset' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT o.output_id, o.store_id, (s.name)store_name, c.commodity_id, \n        (c.name)commodity_name, o.environment_id, (env.name)environment_name, o.employee_gives,\n        (emp.username)employee_gives_name, o.employee_receives, (empp.username)employee_receives_name,\n        o.quantity, o.date_output, o.notes, o.state FROM output o \n        INNER JOIN store s ON s.store_id = o.store_id\n        INNER JOIN commodity c ON c.commodity_id = o.commodity_id\n        INNER JOIN environment env ON env.environment_id = o.environment_id\n        INNER JOIN employee emp ON emp.employee_id = o.employee_gives\n        INNER JOIN employee empp ON empp.employee_id = o.employee_receives\n        WHERE o.date_output LIKE \"%" + dateOutput + "%\" AND o.state = " + state + " ORDER BY o.date_output DESC LIMIT 100";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok) {
                                console.log(data.message);
                                return res.status(data.status).json({ ok: false, message: data.message });
                            }
                            var outputList = data.result[0];
                            for (var i = 0; i < outputList.length; i++) {
                                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_6 = _a.sent();
                    console.log(error_6);
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_6 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getOutputsByDate = getOutputsByDate;
//================== BUSCAR SALIIDA POR FECHA ==================//
function searchOutputByDate(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var search, dateOutput, state, querySearch, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    search = req.body.search;
                    dateOutput = req.body.date_output;
                    state = Number(req.body.state);
                    if (Number.isNaN(state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'state' es obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    querySearch = "SELECT o.output_id, o.store_id, (s.name)store_name, c.commodity_id, \n            (c.name)commodity_name, o.environment_id, (env.name)environment_name, o.employee_gives,\n            (emp.username)employee_gives_name, o.employee_receives, (empp.username)employee_receives_name,\n            o.quantity, o.date_output, o.notes, o.state FROM output o \n            INNER JOIN store s ON s.store_id = o.store_id\n            INNER JOIN commodity c ON c.commodity_id = o.commodity_id\n            INNER JOIN environment env ON env.environment_id = o.environment_id\n            INNER JOIN employee emp ON emp.employee_id = o.employee_gives\n            INNER JOIN employee empp ON empp.employee_id = o.employee_receives\n            WHERE c.name LIKE \"%" + search + "%\" AND o.date_output = \"" + dateOutput + "\" AND o.state = " + state + " ORDER BY o.date_output DESC LIMIT 20";
                    return [4 /*yield*/, query_1.query(querySearch).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            var outputList = data.result[0];
                            for (var i = 0; i < outputList.length; i++) {
                                data.result[0][i].date_output = transformDate(data.result[0][i].date_output);
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_7 = _a.sent();
                    console.log(error_7);
                    console.log('Data: ');
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_7 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.searchOutputByDate = searchOutputByDate;
