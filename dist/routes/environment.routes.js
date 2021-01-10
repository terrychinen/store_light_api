"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var environment_controller_1 = require("../controllers/environment.controller");
var router = express_1.Router();
router.route('/')
    .get(environment_controller_1.getEnvironments)
    .post(environment_controller_1.createEnvironment);
router.route('/:environment_id')
    .put(environment_controller_1.updateEnvironment)
    .delete(environment_controller_1.deleteEnvironment);
router.route('/search')
    .post(environment_controller_1.searchEnvironment);
exports.default = router;
