"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var store_commodity_controller_1 = require("../controllers/store_commodity.controller");
var router = express_1.Router();
router.route('/')
    .get(store_commodity_controller_1.getStoresCommodities)
    .post(store_commodity_controller_1.createStoreCommodity);
// router.route('/:employee_id')
//     .put(updateStoreCommodity);
exports.default = router;
