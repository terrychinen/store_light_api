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
exports.getInputDetail = exports.searchInputByDate = exports.searchInput = exports.deleteCategory = exports.updateInput = exports.createInput = exports.getReceiveOrderDetail = exports.getInputs = void 0;
var query_1 = require("../query/query");
var dateformat_1 = __importDefault(require("dateformat"));
//================== OBTENER TODAS LAS ENTRADAS ==================//
function getInputs(req, res) {
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
                    getQuery = "SELECT purchase_order_id, employee_id, \n        (SELECT username FROM employee e WHERE e.employee_id = i.employee_id)employee_name, \n        input_date, notes, state FROM input i WHERE state = " + state + " LIMIT 20";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            for (var i = 0; i < data.result[0].length; i++) {
                                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
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
exports.getInputs = getInputs;
function transformDate(dateString) {
    if (dateString) {
        var dateTransform = new Date(dateString);
        return dateformat_1.default(dateTransform, 'yyyy-mm-dd HH:MM:ss');
    }
    return null;
}
function getReceiveOrderDetail(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, state, getQuery, error_2;
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
                    getQuery = "SELECT purchase_order_id, \n        (SELECT commodity_id FROM purchase_order_detail WHERE purchase_order_id = p.purchase_order_id)commodity_id,\n        (SELECT name FROM commodity WHERE commodity_id = p.commodity_id)commodity_name,\n        quantity, unit_price, total_price FROM purchase_order p \n        WHERE purchase_order_id  LIMIT 20";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_2 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getReceiveOrderDetail = getReceiveOrderDetail;
//================== CREAR UNA ENTRADA ==================//
function createInput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, input, inputDetail, detail, insertInput, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    input = body;
                    inputDetail = body;
                    detail = body.detail;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (Number.isNaN(input.employee_id) || Number.isNaN(input.purchase_order_id) ||
                        input.input_date == null || input.notes == null ||
                        Number.isNaN(input.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'employee_id', 'pruchase_order_id', 'input_date', \n                'notes' y 'state' son obligatorios!" })];
                    return [4 /*yield*/, checkIfEmployeeAndPurchaseOrderExists(res, input.purchase_order_id, input.employee_id)];
                case 2:
                    _a.sent();
                    insertInput = "INSERT INTO input (purchase_order_id, employee_id, input_date, notes, state) \n                VALUES (" + input.purchase_order_id + ", " + input.employee_id + ", \n                \"" + input.input_date + "\", \"" + input.notes + "\", " + input.state + ")";
                    return [4 /*yield*/, query_1.query(insertInput).then(function (createInputData) { return __awaiter(_this, void 0, void 0, function () {
                            var i, commodityID, storeID, quantity, getStockQuery, stock, totalStock, updateQuery;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!createInputData.ok)
                                            return [2 /*return*/, res.status(createInputData.status)
                                                    .json({ ok: false, message: createInputData.message })];
                                        i = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i < detail.length)) return [3 /*break*/, 6];
                                        commodityID = detail[i].commodity_id;
                                        storeID = detail[i].store_id;
                                        quantity = detail[i].quantity;
                                        return [4 /*yield*/, query_1.query("INSERT INTO input_detail (purchase_order_id, store_id, \n                    commodity_id, quantity) VALUES (" + input.purchase_order_id + ", " + storeID + ", \n                    " + commodityID + ", " + quantity + ")")];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, query_1.query("SELECT stock FROM store_commodity WHERE \n                    store_id = " + storeID + " AND commodity_id = " + commodityID)];
                                    case 3:
                                        getStockQuery = _a.sent();
                                        stock = Number(getStockQuery.result[0][0].stock);
                                        totalStock = stock + quantity;
                                        return [4 /*yield*/, query_1.query("UPDATE store_commodity SET stock = " + totalStock + " WHERE \n                    store_id = " + storeID + " AND commodity_id = " + commodityID)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 6:
                                        updateQuery = "UPDATE purchase_order SET state_input= " + 1 + " WHERE \n                purchase_order_id = " + input.purchase_order_id;
                                        return [4 /*yield*/, query_1.query(updateQuery)];
                                    case 7:
                                        _a.sent();
                                        return [2 /*return*/, res.status(200).json({ ok: true, message: 'Entrada creado correctamente' })];
                                }
                            });
                        }); })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_3 = _a.sent();
                    console.log(error_3);
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_3 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createInput = createInput;
//================== ACTUALIZAR UNA ENTRADA ==================//
function updateInput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var input, purchaseID, detail, queryCheckId, error_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = req.body;
                    purchaseID = req.params.purchase_id;
                    detail = req.body.detail;
                    if (Number.isNaN(purchaseID) || Number.isNaN(input.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'purchaseID' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryCheckId = "SELECT * FROM input WHERE purchase_order_id = " + purchaseID;
                    return [4 /*yield*/, query_1.query(queryCheckId).then(function (dataCheckId) { return __awaiter(_this, void 0, void 0, function () {
                            var updateQuery, getInputDetail_1, i, commodityID, storeID, quantity, getStockQuery, stock, totalStock, i, storeID, commodityID, quantity, getStockQuery, stock, totalStock;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!dataCheckId.ok)
                                            return [2 /*return*/, res.status(500).json({ ok: false, message: dataCheckId.message })];
                                        if (dataCheckId.result[0][0] == null)
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: "La entrada con el id " + purchaseID + " no existe!" })];
                                        return [4 /*yield*/, query_1.query("UPDATE input SET input_date = \"" + input.input_date + "\", notes = \"" + input.notes + "\", \n                state = " + input.state + " WHERE purchase_order_id = " + purchaseID)];
                                    case 1:
                                        updateQuery = _a.sent();
                                        if (!updateQuery.ok) return [3 /*break*/, 15];
                                        return [4 /*yield*/, query_1.query("SELECT store_id, commodity_id, quantity FROM input_detail WHERE purchase_order_id = " + purchaseID)];
                                    case 2:
                                        getInputDetail_1 = _a.sent();
                                        i = 0;
                                        _a.label = 3;
                                    case 3:
                                        if (!(i < getInputDetail_1.result[0].length)) return [3 /*break*/, 8];
                                        commodityID = getInputDetail_1.result[0][i].commodity_id;
                                        storeID = getInputDetail_1.result[0][i].store_id;
                                        quantity = getInputDetail_1.result[0][i].quantity;
                                        return [4 /*yield*/, query_1.query("SELECT stock FROM store_commodity WHERE \n                        store_id = " + storeID + " AND commodity_id = " + commodityID)];
                                    case 4:
                                        getStockQuery = _a.sent();
                                        stock = Number(getStockQuery.result[0][0].stock);
                                        totalStock = stock - quantity;
                                        return [4 /*yield*/, query_1.query("UPDATE store_commodity SET stock = " + totalStock + " WHERE \n                        store_id = " + storeID + " AND commodity_id = " + commodityID)];
                                    case 5:
                                        _a.sent();
                                        return [4 /*yield*/, query_1.query("DELETE FROM input_detail WHERE purchase_order_id = " + purchaseID + " AND \n                        store_id = " + storeID + " AND commodity_id = " + commodityID)];
                                    case 6:
                                        _a.sent();
                                        _a.label = 7;
                                    case 7:
                                        i++;
                                        return [3 /*break*/, 3];
                                    case 8:
                                        i = 0;
                                        _a.label = 9;
                                    case 9:
                                        if (!(i < detail.length)) return [3 /*break*/, 14];
                                        storeID = detail[i].store_id;
                                        commodityID = detail[i].commodity_id;
                                        quantity = detail[i].quantity;
                                        return [4 /*yield*/, query_1.query("INSERT INTO input_detail (purchase_order_id, store_id, \n                        commodity_id, quantity) VALUES (" + input.purchase_order_id + ", " + storeID + ", \n                        " + commodityID + ", " + quantity + ")")];
                                    case 10:
                                        _a.sent();
                                        return [4 /*yield*/, query_1.query("SELECT stock FROM store_commodity WHERE \n                    store_id = " + storeID + " AND commodity_id = " + commodityID)];
                                    case 11:
                                        getStockQuery = _a.sent();
                                        stock = Number(getStockQuery.result[0][0].stock);
                                        totalStock = stock + quantity;
                                        return [4 /*yield*/, query_1.query("UPDATE store_commodity SET stock = " + totalStock + " WHERE \n                            store_id = " + storeID + " AND commodity_id = " + commodityID)];
                                    case 12:
                                        _a.sent();
                                        _a.label = 13;
                                    case 13:
                                        i++;
                                        return [3 /*break*/, 9];
                                    case 14: return [2 /*return*/, res.status(updateQuery.status).json({ ok: true, message: 'La entrada se actualizó correctamente' })];
                                    case 15: return [2 /*return*/, res.status(updateQuery.status).json({ ok: false, message: updateQuery.message })];
                                }
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_4 = _a.sent();
                    console.log("" + error_4);
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_4 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateInput = updateInput;
//================== ELIMINAR UNA ENTRADA POR SU ID ==================//
function deleteCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var categoryID, checkIdQuery, error_5;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    categoryID = req.params.category_id;
                    checkIdQuery = "SELECT * FROM category WHERE category_id = " + categoryID;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, query_1.query(checkIdQuery).then(function (dataCheckId) { return __awaiter(_this, void 0, void 0, function () {
                            var deleteQuery;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (dataCheckId.result[0][0] == null)
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: "La categor\u00EDa con el id " + categoryID + " no existe!" })];
                                        deleteQuery = "DELETE FROM category WHERE category_id = " + categoryID;
                                        return [4 /*yield*/, query_1.query(deleteQuery).then(function (dataDelete) {
                                                if (!dataDelete.ok)
                                                    return res.status(dataDelete.status).json({ ok: false, message: dataDelete.message });
                                                return res.status(dataDelete.status).json({ ok: true, message: 'La categoría se eliminó correctamente' });
                                            })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_5 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_5 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteCategory = deleteCategory;
//================== BUSCAR ENTRADA ==================//
function searchInput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var search, searchBy, state, columnName, querySearch, error_6;
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
                        columnName = 'purchase_order_id';
                    }
                    else {
                        columnName = 'notes';
                    }
                    querySearch = "SELECT purchase_order_id, employee_id, \n        (SELECT username FROM employee e WHERE e.employee_id = i.employee_id)employee_name, \n        input_date, notes, state FROM input i WHERE " + columnName + " LIKE \"%" + search + "%\" AND state = " + state + " LIMIT 20";
                    return [4 /*yield*/, query_1.query(querySearch).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            for (var i = 0; i < data.result[0].length; i++) {
                                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_6 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_6 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.searchInput = searchInput;
//================== BUSCAR ENTRADA ==================//
function searchInputByDate(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var search, state, querySearch, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    search = req.body.search;
                    state = Number(req.body.state);
                    if (search == null || Number.isNaN(state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'search' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    querySearch = "SELECT purchase_order_id, employee_id, \n        (SELECT username FROM employee e WHERE e.employee_id = i.employee_id)employee_name, \n        input_date, notes, state FROM input i WHERE input_date LIKE \"%" + search + "%\" AND state = " + state + " LIMIT 50";
                    return [4 /*yield*/, query_1.query(querySearch).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            for (var i = 0; i < data.result[0].length; i++) {
                                data.result[0][i].input_date = transformDate(data.result[0][i].input_date);
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_7 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_7 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.searchInputByDate = searchInputByDate;
//================== OBTENER TODOS LOS DETALLES DE LA ENTRADA ==================//
function getInputDetail(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var purchaseOrderID, offset, getQuery, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    purchaseOrderID = req.params.purchase_id;
                    offset = Number(req.query.offset);
                    if (Number.isNaN(offset))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'offset' es obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT purchase_order_id,\n        store_id, (SELECT name FROM store WHERE store_id = i.store_id)store_name, \n        commodity_id, (SELECT name FROM commodity WHERE commodity_id = i.commodity_id)commodity_name, \n        quantity FROM input_detail i WHERE purchase_order_id = " + purchaseOrderID;
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_8 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_8 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getInputDetail = getInputDetail;
function checkIfEmployeeAndPurchaseOrderExists(res, purchaseOrderID, employeeID) {
    return __awaiter(this, void 0, void 0, function () {
        var checkIfPurchaseOrderExists, checkIfEmployeeExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, query_1.query("SELECT * FROM purchase_order WHERE \n        purchase_order_id = " + purchaseOrderID)];
                case 1:
                    checkIfPurchaseOrderExists = (_a.sent()).result;
                    if (checkIfPurchaseOrderExists[0][0] == null) {
                        return [2 /*return*/, res.status(400).json({ ok: false, message: 'No existe el ID del órden de pedido' })];
                    }
                    return [4 /*yield*/, query_1.query("SELECT * FROM employee WHERE employee_id = " + employeeID)];
                case 2:
                    checkIfEmployeeExists = (_a.sent()).result;
                    if (checkIfEmployeeExists[0][0] == null) {
                        return [2 /*return*/, res.status(400).json({ ok: false, message: 'No existe el ID del empleado' })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
