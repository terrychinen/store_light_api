"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var employee_controller_1 = require("../controllers/employee.controller");
var router = express_1.Router();
router.route('/')
    .get(employee_controller_1.getEmployees)
    .post(employee_controller_1.createEmployee);
router.route('/:employee_id')
    .put(employee_controller_1.updateEmployee);
exports.default = router;
