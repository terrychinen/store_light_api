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
exports.getByStoreIdCommodityId = exports.searchStoreCommodity = exports.getAllCommoditiesByStoreIDAndCommodityID = exports.getStoresCommoditiesWithStockMin = exports.getCommodityByStoreIDAndCommdotyId = exports.getCommoditiesByStoreID = exports.updateStoreCommodity = exports.createStoreCommodity = exports.getStoresCommodities = void 0;
var query_1 = require("../query/query");
//================== OBTENER TODAS LOS ALMACENES-MERCANCIAS ==================//
function getStoresCommodities(req, res) {
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
                    getQuery = "SELECT sc.store_id, (s.name)store_name, sc.commodity_id, (c.name)commodity_name, \n            sc.stock, sc.stock_min,\n\t\t    (SELECT SUM(stock) FROM store_commodity WHERE commodity_id = sc.commodity_id)stock_total,\n            sc.state FROM store_commodity sc\n            INNER JOIN store s ON s.store_id = sc.store_id\n            INNER JOIN commodity c ON c.commodity_id = sc.commodity_id\n            ORDER BY s.name ASC, c.name ASC";
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
exports.getStoresCommodities = getStoresCommodities;
//================== CREAR ALMACENES-MERCANCIAS ==================//
function createStoreCommodity(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var storeCommodity, checkIfCommodity_StoreExists, insertQuery, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeCommodity = req.body;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (Number.isNaN(storeCommodity.store_id) || Number.isNaN(storeCommodity.commodity_id) ||
                        Number.isNaN(storeCommodity.stock) || Number.isNaN(storeCommodity.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'store_id', 'commodity_id', 'stock' y 'state' son obligatorio!" })];
                    return [4 /*yield*/, checkIfCommodityAndStoreExists(res, storeCommodity.commodity_id, storeCommodity.store_id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, query_1.query("SELECT * FROM store_commodity \n                    WHERE store_id = " + storeCommodity.store_id + " AND commodity_id = " + storeCommodity.commodity_id)];
                case 3:
                    checkIfCommodity_StoreExists = (_a.sent()).result;
                    if (!(checkIfCommodity_StoreExists[0][0] == null)) return [3 /*break*/, 5];
                    insertQuery = "INSERT INTO store_commodity (store_id, commodity_id, stock, stock_min, state) VALUES \n                 (" + storeCommodity.store_id + ", " + storeCommodity.commodity_id + ",  \n                     " + storeCommodity.stock + ", " + storeCommodity.stock_min + ", " + storeCommodity.state + ")";
                    return [4 /*yield*/, query_1.query(insertQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5: return [2 /*return*/, res.status(400).json({ ok: false, message: 'Ya existe esa asociación' })];
                case 6: return [2 /*return*/, res.status(200).json({ ok: true, message: 'Se creó correctamente la asociación' })];
                case 7:
                    error_2 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_2 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.createStoreCommodity = createStoreCommodity;
//================== ACTUALIZAR ALMACENES-MERCANCIAS ==================//
function updateStoreCommodity(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var storeCommodity, updateQuery, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeCommodity = req.body;
                    if (Number.isNaN(storeCommodity.store_id) || Number.isNaN(storeCommodity.commodity_id) ||
                        Number.isNaN(storeCommodity.stock) || Number.isNaN(storeCommodity.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'store_id', 'commodity_id', 'stock' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, checkIfCommodityAndStoreExists(res, storeCommodity.commodity_id, storeCommodity.store_id)];
                case 2:
                    _a.sent();
                    updateQuery = "UPDATE store_commodity SET stock = " + storeCommodity.stock + ", \n            stock_min = " + storeCommodity.stock_min + ", state = " + storeCommodity.state + " WHERE \n            store_id = " + storeCommodity.store_id + " AND \n            commodity_id = " + storeCommodity.commodity_id;
                    return [4 /*yield*/, query_1.query(updateQuery).then(function (dataUpdate) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!dataUpdate.ok)
                                    return [2 /*return*/, res.status(dataUpdate.status).json({ ok: false, message: dataUpdate.message })];
                                return [2 /*return*/, res.status(dataUpdate.status).json({ ok: true, message: 'La asociación se actualizó correctamente' })];
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
exports.updateStoreCommodity = updateStoreCommodity;
//================== OBTENER TODAS LAS MERCANCIAS POR EL ID DEL ALMACEN ==================//
function getCommoditiesByStoreID(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var storeID, search, offset, state, getQuery, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeID = Number(req.params.store_id);
                    search = req.body.search;
                    offset = Number(req.body.offset);
                    state = Number(req.body.state);
                    if (Number.isNaN(offset) || Number.isNaN(state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'offset' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT sc.commodity_id, (c.name)commodity_name,\n            sc.stock, sc.stock_min, sc.state FROM store_commodity sc \n            INNER JOIN commodity c ON c.commodity_id = sc.commodity_id\n            WHERE store_id = " + storeID + " AND c.name LIKE '%" + search + "%' LIMIT 10";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_4 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_4 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getCommoditiesByStoreID = getCommoditiesByStoreID;
//================== OBTENER TODAS LAS MERCANCIAS POR EL ID DEL ALMACEN Y DEL ID DE LA MERCANCIA==================//
function getCommodityByStoreIDAndCommdotyId(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var storeID, commodityID, getQuery, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeID = Number(req.params.store_id);
                    commodityID = Number(req.params.commodity_id);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT stock FROM store_commodity WHERE store_id = " + storeID + " AND commodity_id = " + commodityID + " LIMIT 1";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
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
exports.getCommodityByStoreIDAndCommdotyId = getCommodityByStoreIDAndCommdotyId;
//================== OBTENER TODAS LAS MERCANCIAS CON STOCK MIN ==================//
function getStoresCommoditiesWithStockMin(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, state, getQuery, error_6;
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
                    getQuery = "SELECT sc.store_id, (s.name)store_name, sc.commodity_id, (c.name)commodity_name,\n            cate.category_id, (cate.name)category_name, sc.stock, sc.stock_min,\n\t\t    (SELECT SUM(stock) FROM store_commodity WHERE commodity_id = sc.commodity_id)stock_total,\n            sc.state FROM store_commodity sc\n            INNER JOIN store s ON s.store_id = sc.store_id\n            INNER JOIN commodity c ON c.commodity_id = sc.commodity_id\n            INNER JOIN category cate on cate.category_id = c.category_id\n            WHERE stock <= stock_min\n            ORDER BY s.name ASC, c.name ASC";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
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
exports.getStoresCommoditiesWithStockMin = getStoresCommoditiesWithStockMin;
//================== OBTENER TODAS LAS MERCANCIAS POR EL ID DEL ALMACEN Y DE LA CATEGORIA ==================//
function getAllCommoditiesByStoreIDAndCommodityID(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var storeID, categoryID, getQuery, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeID = Number(req.params.store_id);
                    categoryID = Number(req.params.category_id);
                    if (Number.isNaN(storeID) || Number.isNaN(categoryID))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'storeID' y 'categoryID' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT sc.commodity_id, (comm.name)commodity_name, \n        (cate.name)category_name, sc.stock, sc.stock_min,\n        (SELECT SUM(stock) FROM store_commodity tt WHERE tt.commodity_id = sc.commodity_id)stock_total \n        FROM store_commodity sc\n        INNER JOIN commodity comm ON comm.commodity_id = sc.commodity_id \n        INNER JOIN category cate ON cate.category_id = comm.category_id\n        WHERE sc.store_id = " + storeID + " AND comm.category_id = " + categoryID + " \n        ORDER BY comm.name ASC";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
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
exports.getAllCommoditiesByStoreIDAndCommodityID = getAllCommoditiesByStoreIDAndCommodityID;
//================== BUSCAR MERCANCIA - ALMACEN  ==================//
function searchStoreCommodity(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var search, searchBy, state, columnName, querySearch, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    search = req.body.search;
                    searchBy = req.body.search_by;
                    state = Number(req.body.state);
                    if (search == null || Number.isNaN(state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'search' y 'state' son obligatorios!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    columnName = '';
                    if (searchBy == 0) {
                        columnName = 'sc.commodity_id';
                    }
                    else if (searchBy == 1) {
                        columnName = 'comm.name';
                    }
                    querySearch = "SELECT sc.commodity_id, (comm.name)commodity_name, comm.category_id,\n            (cate.name)category_name, sc.store_id, (s.name)store_name, sc.stock, sc.stock_min,\n            (SELECT SUM(stock) FROM store_commodity WHERE commodity_id = sc.commodity_id)stock_total, \n            sc.state FROM store_commodity sc\n            INNER JOIN store s ON s.store_id = sc.store_id\n            INNER JOIN commodity comm ON comm.commodity_id = sc.commodity_id\n            INNER JOIN category cate ON cate.category_id = comm.category_id\n            WHERE " + columnName + " LIKE \"%" + search + "%\" AND sc.state = " + state + "\n            ORDER BY comm.name ASC LIMIT 50";
                    return [4 /*yield*/, query_1.query(querySearch).then(function (data) {
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
exports.searchStoreCommodity = searchStoreCommodity;
//================== OBTENER TODAS LAS MERCANCIAS POR EL ID DEL ALMACEN ==================//
function getByStoreIdCommodityId(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var storeID, commodityID, getQuery, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeID = Number(req.query.store_id);
                    commodityID = Number(req.query.commodity_id);
                    if (Number.isNaN(storeID) || Number.isNaN(commodityID))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'storeID' y 'commodityID' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    getQuery = "SELECT sc.store_id, (s.name)store_name, sc.commodity_id, (c.name)commodity_name,\n            sc.stock, sc.stock_min, sc.state FROM store_commodity sc \n            INNER JOIN commodity c ON c.commodity_id = sc.commodity_id\n            INNER JOIN store s ON s.store_id = sc.store_id\n            WHERE sc.store_id = " + storeID + " AND sc.commodity_id = " + commodityID + " LIMIT 1";
                    return [4 /*yield*/, query_1.query(getQuery).then(function (data) {
                            if (!data.ok) {
                                console.log(data.message);
                                return res.status(data.status).json({ ok: false, message: data.message });
                            }
                            return res.status(data.status).json({ ok: true, message: data.message, result: data.result[0] });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_9 = _a.sent();
                    console.log(error_9);
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_9 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getByStoreIdCommodityId = getByStoreIdCommodityId;
function checkIfCommodityAndStoreExists(res, commodityID, storeID) {
    return __awaiter(this, void 0, void 0, function () {
        var checkIfCommodityExists, checkIfStoreExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, query_1.query("SELECT * FROM commodity WHERE commodity_id = " + commodityID)];
                case 1:
                    checkIfCommodityExists = (_a.sent()).result;
                    if (checkIfCommodityExists[0][0] == null) {
                        return [2 /*return*/, res.status(400).json({ ok: false, message: 'No existe el ID de la mercancía' })];
                    }
                    return [4 /*yield*/, query_1.query("SELECT * FROM store WHERE store_id = " + storeID)];
                case 2:
                    checkIfStoreExists = (_a.sent()).result;
                    if (checkIfStoreExists[0][0] == null) {
                        return [2 /*return*/, res.status(400).json({ ok: false, message: 'No existe el ID del almacén' })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
