"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var router = express_1.Router();
router.route('/signin').post(auth_controller_1.signIn);
router.route('/signup').post(auth_controller_1.signUp);
exports.default = router;
