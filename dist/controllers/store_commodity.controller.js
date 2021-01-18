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
exports.createStoreCommodity = exports.getStoresCommodities = void 0;
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
                    getQuery = "SELECT sc.store_id, (SELECT name FROM store WHERE store_id = sc.store_id)store_name, \n        sc.commodity_id, (SELECT name FROM commodity WHERE commodity_id = sc.commodity_id)commodity_name, \n        sc.stock, (SELECT SUM(stock) FROM store_commodity WHERE commodity_id = sc.commodity_id)stock_total, \n        sc.state FROM store_commodity sc WHERE sc.state = " + state;
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
        var storeCommodityList, i, storeCommodity, checkIfCommodity_StoreExists, insertQuery, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeCommodityList = req.body.store_commodity;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < storeCommodityList.length)) return [3 /*break*/, 8];
                    storeCommodity = storeCommodityList[i];
                    return [4 /*yield*/, checkIfCommodityAndStoreExists(res, storeCommodity.commodity_id, storeCommodity.store_id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, query_1.query("SELECT * FROM store_commodity \n                    WHERE store_id = " + storeCommodity.store_id + " AND commodity_id = " + storeCommodity.commodity_id)];
                case 4:
                    checkIfCommodity_StoreExists = (_a.sent()).result;
                    if (!(checkIfCommodity_StoreExists[0][0] == null)) return [3 /*break*/, 6];
                    insertQuery = "INSERT INTO store_commodity (store_id, commodity_id, stock, state) VALUES \n                 (\"" + storeCommodity.store_id + "\", \"" + storeCommodity.commodity_id + "\", \n                     \"" + storeCommodity.stock + "\", \"" + storeCommodity.state + "\")";
                    return [4 /*yield*/, query_1.query(insertQuery).then(function (data) {
                            if (!data.ok)
                                return res.status(data.status).json({ ok: false, message: data.message });
                        })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6: return [2 /*return*/, res.status(400).json({ ok: false, message: 'Ya existe esa asociación' })];
                case 7:
                    i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, res.status(200).json({ ok: true, message: 'Se creó correctamente la asociación' })];
                case 9:
                    error_2 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_2 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.createStoreCommodity = createStoreCommodity;
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
/*
//================== ACTUALIZAR ALMACENES-MERCANCIAS ==================//
export async function updateStoreCommodity(req: Request, res: Response) {
    const storeCommodity: StoreCommodityModel = req.body;

    if(Number.isNaN(storeCommodity.store_id) || Number.isNaN(storeCommodity.commodity_id) ||
    Number.isNaN(storeCommodity.stock) || Number.isNaN(storeCommodity.state)) return res.status(404).json({ok: false, message: `La variable 'store_id', 'commodity_id', 'stock' y 'state' son obligatorio!`});
    try {

        const queryCheckStoreID = `SELECT * FROM store_commodity WHERE store_id = ${storeCommodity.store_id}`;

        return await query(queryCheckStoreID).then(async dataCheckStoreId => {
            if(!dataCheckStoreId.ok) return res.status(500).json({ok: false, message: dataCheckStoreId.message});
            if(dataCheckStoreId.result[0][0] == null) return res.status(400).json({ok: false, message: `El almacén con el id ${storeCommodity.store_id} no existe!`});

            const queryCheckCommodityID = `SELECT * FROM store_commodity WHERE commodity_id = ${storeCommodity.commodity_id}`;

            return await query(queryCheckCommodityID).then(async dataCheckCommodityId => {
                if(!dataCheckCommodityId.ok) return res.status(500).json({ok: false, message: dataCheckCommodityId.message});
                if(dataCheckCommodityId.result[0][0] == null) return res.status(400).json({ok: false, message: `La mercancía con el id ${storeCommodity.commodity_id} no existe!`});

                const updateQuery = `UPDATE store_commdity SET store_id=${storeCommodity.store_id}, state = "${category.state}" WHERE category_id = "${categoryID}"`;
    
                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});
                    return res.status(dataUpdate.status).json({ok: true, message: 'La categoría se actualizó correctamente'});
                });
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
} */ 
