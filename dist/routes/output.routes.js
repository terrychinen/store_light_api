"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var output_controller_1 = require("../controllers/output.controller");
var router = express_1.Router();
router.route('/')
    .get(output_controller_1.getOutputs)
    .post(output_controller_1.createOutput);
exports.default = router;
