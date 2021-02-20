"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var output_controller_1 = require("../controllers/output.controller");
var router = express_1.Router();
router.route('/')
    .get(output_controller_1.getOutputs)
    .post(output_controller_1.createOutput);
router.route('/:output_id')
    .put(output_controller_1.updateOutput);
router.route('/stock/:output_id')
    .put(output_controller_1.updateStock);
exports.default = router;
