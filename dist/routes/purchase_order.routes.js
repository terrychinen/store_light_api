"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var purcharse_order_1 = require("../controllers/purcharse_order");
var router = express_1.Router();
router.route('/')
    .get(purcharse_order_1.getPurchaseOrders)
    .post(purcharse_order_1.createPurchaseOrder);
router.route('/:purchase_id')
    .get(purcharse_order_1.getPurchaseOrderDetail)
    .put(purcharse_order_1.updatePurchaseOrder);
router.route('/with/state')
    .get(purcharse_order_1.getPurchaseOrdersWithState);
exports.default = router;
