"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var input_controller_1 = require("../controllers/input.controller");
var router = express_1.Router();
router.route('/')
    .get(input_controller_1.getInputs)
    .post(input_controller_1.createInput);
router.route('/:purchase_id')
    .get(input_controller_1.getInputDetail)
    .post(input_controller_1.getInput)
    .put(input_controller_1.updateInput);
router.route('/search')
    .post(input_controller_1.searchInput);
router.route('/phone/create')
    .post(input_controller_1.createInputPhone);
router.route('/phone/delete/detail')
    .post(input_controller_1.deleteInputDetailPhone);
router.route('/phone/create/detail')
    .post(input_controller_1.createInputDetailPhone);
router.route('/phone/order/search')
    .get(input_controller_1.getInputsPhone)
    .post(input_controller_1.searchInputByOrder);
router.route('/phone/detail/search')
    .get(input_controller_1.getInputDetailByDate)
    .post(input_controller_1.searchInputByCommodity);
router.route('/search/bydate')
    .post(input_controller_1.searchInputByDate);
exports.default = router;
