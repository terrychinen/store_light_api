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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCategory = exports.deleteCategory = exports.updateInput = exports.createInput = exports.getReceiveOrderDetail = exports.getInputs = void 0;
var query_1 = require("../query/query");
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
                    getQuery = "SELECT purchase_order_id, employee_id, \n        (SELECT username FROM employee WHERE employee_id = i.employee_id)username, \n        input_date, notes, state FROM input i WHERE state = " + state + " LIMIT 20";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
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
                            var inputID, i, insertInputDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!createInputData.ok)
                                            return [2 /*return*/, res.status(createInputData.status)
                                                    .json({ ok: false, message: createInputData.message })];
                                        inputID = createInputData.result[0].insertId;
                                        i = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i < detail.length)) return [3 /*break*/, 4];
                                        insertInputDetail = "INSERT INTO input_detail (input_id, store_id, commodity_id, quantity) \n                VALUES (" + inputID + ", " + detail[i].store_id + ", " + detail[i].commodity_id + ", " + detail[i].quantity + ")";
                                        return [4 /*yield*/, query_1.query(insertInputDetail)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/, res.status(200).json({ ok: true, message: 'Entrada creado correctamente' })];
                                }
                            });
                        }); })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_3 = _a.sent();
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
        var input, inputID, queryCheckId, error_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = req.body;
                    inputID = req.params.input_id;
                    if (Number.isNaN(inputID) || Number.isNaN(input.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'category_id', 'name' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryCheckId = "SELECT * FROM input WHERE input_id = " + inputID;
                    return [4 /*yield*/, query_1.query(queryCheckId).then(function (dataCheckId) { return __awaiter(_this, void 0, void 0, function () {
                            var updateQuery;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!dataCheckId.ok)
                                            return [2 /*return*/, res.status(500).json({ ok: false, message: dataCheckId.message })];
                                        if (dataCheckId.result[0][0] == null)
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: "La entrada con el id " + inputID + " no existe!" })];
                                        updateQuery = '';
                                        return [4 /*yield*/, query_1.query(updateQuery).then(function (dataUpdate) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    if (!dataUpdate.ok)
                                                        return [2 /*return*/, res.status(dataUpdate.status).json({ ok: false, message: dataUpdate.message })];
                                                    return [2 /*return*/, res.status(dataUpdate.status).json({ ok: true, message: 'La categoría se actualizó correctamente' })];
                                                });
                                            }); })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_4 = _a.sent();
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
function searchCategory(req, res) {
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
                        columnName = 'category_id';
                    }
                    else {
                        columnName = 'name';
                    }
                    querySearch = "SELECT * FROM category WHERE " + columnName + " LIKE \"%" + search + "%\" AND state = " + state + " LIMIT 10";
                    return [4 /*yield*/, query_1.query(querySearch).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
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
exports.searchCategory = searchCategory;
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
