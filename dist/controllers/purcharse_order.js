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
exports.getPurchaseOrderByDatePhone = exports.getPurchaseOrdersWithState = exports.updatePurchaseOrder = exports.createPurchaseOrder = exports.getPurchaseOrderDetail = exports.getPurchaseOrders = void 0;
var dateformat_1 = __importDefault(require("dateformat"));
var query_1 = require("../query/query");
//================== OBTENER TODOS LOS ORDENES DE PEDIDOS ==================//
function getPurchaseOrders(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, getQuery, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offset = Number(req.query.offset);
                    if (Number.isNaN(offset))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'offset' es obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT purchase_order_id, provider_id, \n        (SELECT name FROM provider WHERE provider_id = po.provider_id)provider_name, \n        employee_id, (SELECT username FROM employee WHERE employee_id = po.employee_id)employee_name, \n        order_date, waiting_date, expected_date, receive_date, paid_date, cancel_date, total_price, message, updated_by, \n        (SELECT name FROM employee WHERE employee_id = po.updated_by)updated_name,\n        state, state_input FROM purchase_order po ORDER BY state ASC, order_date DESC LIMIT 200";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            for (var i = 0; i < data.result[0].length; i++) {
                                data.result[0][i].order_date = transformDate(data.result[0][i].order_date);
                                data.result[0][i].expected_date = transformDate(data.result[0][i].expected_date);
                                data.result[0][i].receive_date = transformDate(data.result[0][i].receive_date);
                                data.result[0][i].paid_date = transformDate(data.result[0][i].paid_date);
                            }
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
exports.getPurchaseOrders = getPurchaseOrders;
function transformDate(dateString) {
    if (dateString) {
        var dateTransform = new Date(dateString);
        return dateformat_1.default(dateTransform, 'yyyy-mm-dd HH:MM:ss');
    }
    return null;
}
//================== OBTENER TODOS LOS DETALLES DEL ORDEN DE PEDIDO ==================//
function getPurchaseOrderDetail(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var purchaseOrderID, offset, getQuery, error_2;
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
                    getQuery = "SELECT pod.purchase_order_id, pod.commodity_id, \n        comm.name, pod.quantity, pod.unit_price, pod.total_price \n        FROM purchase_order_detail pod \n        INNER JOIN commodity comm ON comm.commodity_id = pod.commodity_id\n        WHERE pod.purchase_order_id = " + purchaseOrderID + " ORDER BY comm.name ASC";
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
exports.getPurchaseOrderDetail = getPurchaseOrderDetail;
//================== CREAR UN ORDEN DE PEDIDO ==================//
function createPurchaseOrder(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, purchaseOrder, detail, insertOrder, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    purchaseOrder = body;
                    detail = body.detail;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (purchaseOrder.provider_id == null || Number.isNaN(purchaseOrder.employee_id) ||
                        purchaseOrder.order_date == null || purchaseOrder.total_price == null ||
                        Number.isNaN(purchaseOrder.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'provider_id', 'employee_id', 'order_date', 'total_price' y 'state' son obligatorios!" })];
                    return [4 /*yield*/, checkIfProviderAndEmployeeExists(res, purchaseOrder.provider_id, purchaseOrder.employee_id)];
                case 2:
                    _a.sent();
                    insertOrder = '';
                    insertOrder = "INSERT INTO purchase_order (provider_id, employee_id, order_date, waiting_date, expected_date, \n            receive_date, paid_date, cancel_date, total_price, message, state) VALUES (" + purchaseOrder.provider_id + ", " + purchaseOrder.employee_id + ", \n                \"" + purchaseOrder.order_date + "\", NULLIF('" + purchaseOrder.waiting_date + "', 'null'),\n                NULLIF('" + purchaseOrder.expected_date + "', 'null'), NULLIF('" + purchaseOrder.receive_date + "', 'null'), \n                NULLIF('" + purchaseOrder.paid_date + "', 'null'), NULLIF('" + purchaseOrder.cancel_date + "', 'null'), \n                " + purchaseOrder.total_price + ", \"" + purchaseOrder.message + "\", " + purchaseOrder.state + ")";
                    return [4 /*yield*/, query_1.query(insertOrder).then(function (createOrderData) { return __awaiter(_this, void 0, void 0, function () {
                            var purchaseOrderID, i, insertOrderDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!createOrderData.ok) {
                                            console.log(createOrderData.message);
                                            return [2 /*return*/, res.status(createOrderData.status).json({ ok: false, message: createOrderData.message })];
                                        }
                                        purchaseOrderID = createOrderData.result[0].insertId;
                                        i = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i < detail.length)) return [3 /*break*/, 4];
                                        insertOrderDetail = "INSERT INTO purchase_order_detail (purchase_order_id, commodity_id, quantity, unit_price, \n                    total_price) VALUES (" + purchaseOrderID + ", " + detail[i].commodity_id + ", " + detail[i].quantity + ", \n                            " + detail[i].unit_price + ", " + detail[i].commodity_total_price + ")";
                                        return [4 /*yield*/, query_1.query(insertOrderDetail)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/, res.status(200).json({ ok: true, message: 'Órden de pedido creado correctamente' })];
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
exports.createPurchaseOrder = createPurchaseOrder;
//================== ACTUALIZAR UN ORDEN DE PEDIDO ==================//
function updatePurchaseOrder(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, purchaseOrder, purchaseOrderID, detail, updateQuery, error_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    purchaseOrder = body;
                    purchaseOrderID = req.params.purchase_id;
                    detail = body.detail;
                    console.log(purchaseOrder.order_date);
                    if (purchaseOrder.provider_id == null || Number.isNaN(purchaseOrder.employee_id) ||
                        purchaseOrder.order_date == null || purchaseOrder.total_price == null ||
                        Number.isNaN(purchaseOrder.state))
                        return [2 /*return*/, res.status(404).json({
                                ok: false,
                                message: "La variable 'provider_id', 'employee_id', 'order_date', 'total_price' y 'state' son obligatorios!"
                            })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, checkIfProviderAndEmployeeExists(res, purchaseOrder.provider_id, purchaseOrder.updated_by)];
                case 2:
                    _a.sent();
                    updateQuery = "UPDATE purchase_order SET provider_id=" + purchaseOrder.provider_id + ", \n            order_date = NULLIF('" + purchaseOrder.order_date + "', 'null'), \n            waiting_date = NULLIF('" + purchaseOrder.waiting_date + "', 'null'), \n            expected_date = NULLIF('" + purchaseOrder.expected_date + "', 'null'), \n            receive_date = NULLIF('" + purchaseOrder.receive_date + "', 'null'), \n            paid_date= NULLIF('" + purchaseOrder.paid_date + "', 'null'), \n            cancel_date =  NULLIF('" + purchaseOrder.cancel_date + "', 'null'), \n            total_price=" + purchaseOrder.total_price + ", updated_by=" + purchaseOrder.updated_by + ", \n            message = '" + purchaseOrder.message + "', state=" + purchaseOrder.state + " WHERE purchase_order_id = " + purchaseOrderID;
                    return [4 /*yield*/, query_1.query(updateQuery).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var deleteQuery, i, insertOrderDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!data.ok)
                                            return [2 /*return*/, res.status(data.status).json({ ok: false, message: data.message })];
                                        deleteQuery = "DELETE FROM purchase_order_detail WHERE purchase_order_id = " + purchaseOrderID;
                                        return [4 /*yield*/, query_1.query(deleteQuery)];
                                    case 1:
                                        _a.sent();
                                        i = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(i < detail.length)) return [3 /*break*/, 5];
                                        insertOrderDetail = "INSERT INTO purchase_order_detail (purchase_order_id, commodity_id, quantity, unit_price, \n                    total_price) VALUES (" + purchaseOrderID + ", " + detail[i].commodity_id + ", " + detail[i].quantity + ", \n                            " + detail[i].unit_price + ", " + detail[i].commodity_total_price + ")";
                                        return [4 /*yield*/, query_1.query(insertOrderDetail)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/, res.status(data.status).json({ ok: true, message: 'El órden de pedido se actualizó correctamente' })];
                                }
                            });
                        }); })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_4 = _a.sent();
                    console.log(error_4);
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_4 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updatePurchaseOrder = updatePurchaseOrder;
function checkIfProviderAndEmployeeExists(res, providerID, employeeID) {
    return __awaiter(this, void 0, void 0, function () {
        var checkIfProviderExists, checkIfEmployeeExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, query_1.query("SELECT * FROM provider WHERE provider_id = " + providerID)];
                case 1:
                    checkIfProviderExists = (_a.sent()).result;
                    if (checkIfProviderExists[0][0] == null) {
                        return [2 /*return*/, res.status(400).json({ ok: false, message: 'No existe el ID del proveedor' })];
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
function getPurchaseOrdersWithState(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, state, getQuery, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offset = Number(req.query.offset);
                    state = Number(req.query.state);
                    if (Number.isNaN(offset))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'offset' es obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT purchase_order_id, provider_id, \n        (SELECT name FROM provider WHERE provider_id = po.provider_id)provider_name, \n        employee_id, (SELECT username FROM employee WHERE employee_id = po.employee_id)employee_name, \n        order_date, waiting_date, expected_date, receive_date, paid_date, cancel_date, total_price, message, updated_by, \n        (SELECT name FROM employee WHERE employee_id = po.updated_by)updated_name,\n        state, state_input FROM purchase_order po WHERE state = " + state + " ORDER BY order_date DESC LIMIT 20";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            for (var i = 0; i < data.result[0].length; i++) {
                                data.result[0][i].order_date = transformDate(data.result[0][i].order_date);
                                data.result[0][i].waiting_date = transformDate(data.result[0][i].waiting_date);
                                data.result[0][i].expected_date = transformDate(data.result[0][i].expected_date);
                                data.result[0][i].receive_date = transformDate(data.result[0][i].receive_date);
                                data.result[0][i].paid_date = transformDate(data.result[0][i].paid_date);
                            }
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_5 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_5 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPurchaseOrdersWithState = getPurchaseOrdersWithState;
function getPurchaseOrderByDatePhone(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var getQuery, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    getQuery = "SELECT purchase_order_id, provider_id, \n        (SELECT name FROM provider WHERE provider_id = po.provider_id)provider_name, \n        employee_id, (SELECT username FROM employee WHERE employee_id = po.employee_id)employee_name,\n        order_date, receive_date, paid_date, cancel_date, total_price, message, updated_by, \n        (SELECT name FROM employee WHERE employee_id = po.updated_by)updated_name,\n        state, state_input FROM purchase_order po WHERE state_input = 0 ORDER BY receive_date DESC";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok) {
                                console.log(data.message);
                                return res.status(data.status).json({ ok: false, message: data.message });
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_6 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_6 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getPurchaseOrderByDatePhone = getPurchaseOrderByDatePhone;
