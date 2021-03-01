"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var input_controller_1 = require("../controllers/input.controller");
var router = express_1.Router();
router.route('/')
    .get(input_controller_1.getInputs)
    .post(input_controller_1.createInput);
exports.default = router;
