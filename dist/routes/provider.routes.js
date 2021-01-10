"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var provider_controller_1 = require("../controllers/provider.controller");
var router = express_1.Router();
router.route('/')
    .get(provider_controller_1.getProviders)
    .post(provider_controller_1.createProvider);
router.route('/:provider_id')
    .put(provider_controller_1.updateProvider)
    .delete(provider_controller_1.deleteProvider);
router.route('/search')
    .post(provider_controller_1.searchProvider);
exports.default = router;
