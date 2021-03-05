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
    .put(input_controller_1.updateInput);
router.route('/search')
    .post(input_controller_1.searchInput);
router.route('/search/bydate')
    .post(input_controller_1.searchInputByDate);
exports.default = router;
