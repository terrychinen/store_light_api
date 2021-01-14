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
exports.searchCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
var query_1 = require("../query/query");
//================== OBTENER TODAS LAS CATEGORIAS ==================//
function getCategories(req, res) {
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
                    getQuery = "SELECT * FROM category WHERE state = " + state;
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
exports.getCategories = getCategories;
//================== CREAR UNA CATEGORIA ==================//
function createCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var category, categoryName, queryCheck, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    category = req.body;
                    if (category.name == null || Number.isNaN(category.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'name' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    categoryName = category.name;
                    category.name = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
                    queryCheck = "SELECT * FROM category WHERE name = \"" + category.name + "\"";
                    return [4 /*yield*/, query_1.query(queryCheck).then(function (dataCheck) { return __awaiter(_this, void 0, void 0, function () {
                            var insertQuery;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (dataCheck.result[0][0] != null) {
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: 'La categoría ya existe!' })];
                                        }
                                        insertQuery = "INSERT INTO category (name, state) VALUES (\"" + category.name + "\", \"" + category.state + "\")";
                                        return [4 /*yield*/, query_1.query(insertQuery).then(function (data) {
                                                if (!data.ok)
                                                    return res.status(data.status).json({ ok: false, message: data.message });
                                                return res.status(data.status).json({ ok: true, message: 'Categoría creado correctamente' });
                                            })];
                                    case 1: return [2 /*return*/, _a.sent()];
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
exports.createCategory = createCategory;
//================== ACTUALIZAR UNA CATEGORIA ==================//
function updateCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var category, categoryID, categoryName, queryCheckId, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    category = req.body;
                    categoryID = req.params.category_id;
                    if (category.name == null || Number.isNaN(category.state))
                        return [2 /*return*/, res.status(404).json({ ok: false, message: "La variable 'environment_id', 'name' y 'state' son obligatorio!" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    categoryName = category.name;
                    category.name = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
                    queryCheckId = "SELECT * FROM category WHERE category_id = \"" + categoryID + "\"";
                    return [4 /*yield*/, query_1.query(queryCheckId).then(function (dataCheckId) { return __awaiter(_this, void 0, void 0, function () {
                            var queryCheck;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!dataCheckId.ok)
                                            return [2 /*return*/, res.status(500).json({ ok: false, message: dataCheckId.message })];
                                        if (dataCheckId.result[0][0] == null)
                                            return [2 /*return*/, res.status(400).json({ ok: false, message: "La categor\u00EDa con el id " + categoryID + " no existe!" })];
                                        queryCheck = "SELECT * FROM category WHERE name = \"" + category.name + "\"";
                                        return [4 /*yield*/, query_1.query(queryCheck).then(function (dataCheck) { return __awaiter(_this, void 0, void 0, function () {
                                                var updateQuery;
                                                var _this = this;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!dataCheck.ok)
                                                                return [2 /*return*/, res.status(500).json({ ok: false, message: dataCheck.message })];
                                                            if (dataCheck.result[0][0] != null)
                                                                return [2 /*return*/, res.status(406).json({ ok: false, message: 'La categoría ya existe!' })];
                                                            updateQuery = "UPDATE category SET name=\"" + category.name + "\", state = \"" + category.state + "\" WHERE category_id = \"" + categoryID + "\"";
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
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
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
exports.updateCategory = updateCategory;
//================== ELIMINAR UNA CATEGORIA POR SU ID ==================//
function deleteCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var categoryID, checkIdQuery, error_4;
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
                    error_4 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ ok: false, message: error_4 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteCategory = deleteCategory;
//================== BUSCAR CATEGORIA POR SU NOMBRE  ==================//
function searchCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var search, state, querySearch, error_5;
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
                    querySearch = "SELECT * FROM category WHERE name LIKE \"%" + search + "%\" AND state = " + state + " LIMIT 10";
                    return [4 /*yield*/, query_1.query(querySearch).then(function (data) {
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
exports.searchCategory = searchCategory;
