"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var store_controller_1 = require("../controllers/store.controller");
var router = express_1.Router();
router.route('/')
    .get(store_controller_1.getStores)
    .post(store_controller_1.createStore);
router.route('/:store_id')
    .put(store_controller_1.updateStore)
    .delete(store_controller_1.deleteStore);
router.route('/search')
    .post(store_controller_1.searchStore);
exports.default = router;
