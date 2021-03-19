"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var category_controller_1 = require("../controllers/category.controller");
var router = express_1.Router();
router.route('/')
    .get(category_controller_1.getCategories)
    .post(category_controller_1.createCategory);
router.route('/:category_id')
    .put(category_controller_1.updateCategory)
    .delete(category_controller_1.deleteCategory);
router.route('/search')
    .post(category_controller_1.searchCategory);
router.route('/with/types/:store_id')
    .get(category_controller_1.getCategoriesWithCommodityQuantity);
exports.default = router;
