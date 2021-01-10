"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index_controller_1 = require("../controllers/index.controller");
var router = express_1.Router();
router.route('/').get(index_controller_1.indexWelcome);
exports.default = router;
