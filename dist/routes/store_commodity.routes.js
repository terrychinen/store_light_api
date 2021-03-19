"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var store_commodity_controller_1 = require("../controllers/store_commodity.controller");
var router = express_1.Router();
router.route('/')
    .get(store_commodity_controller_1.getStoresCommodities)
    .post(store_commodity_controller_1.createStoreCommodity)
    .put(store_commodity_controller_1.updateStoreCommodity);
router.route('/:store_id')
    .post(store_commodity_controller_1.getCommoditiesByStoreID);
router.route('/stock/:store_id/:commodity_id')
    .post(store_commodity_controller_1.getCommodityByStoreIDAndCommdotyId);
router.route('/store/category/:store_id/:category_id')
    .get(store_commodity_controller_1.getAllCommoditiesByStoreIDAndCommodityID);
router.route('/stock_min')
    .get(store_commodity_controller_1.getStoresCommoditiesWithStockMin);
exports.default = router;
