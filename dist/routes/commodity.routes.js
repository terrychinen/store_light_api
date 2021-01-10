"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var commodity_controller_1 = require("../controllers/commodity.controller");
var router = express_1.Router();
router.route('/')
    .get(commodity_controller_1.getCommodities)
    .post(commodity_controller_1.createCommodity);
router.route('/:commodity_id')
    .put(commodity_controller_1.updateCommodity)
    .delete(commodity_controller_1.deleteCommodity);
router.route('/search')
    .post(commodity_controller_1.searchCommodity);
exports.default = router;
