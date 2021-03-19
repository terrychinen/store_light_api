import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, searchCategory, getCategoriesWithCommodityQuantity } from '../controllers/category.controller';

const router = Router();


router.route('/')
    .get(getCategories)
    .post(createCategory);


router.route('/:category_id')
    .put(updateCategory)
    .delete(deleteCategory);


router.route('/search')
    .post(searchCategory);

router.route('/with/types/:store_id')
    .get(getCategoriesWithCommodityQuantity)

export default router;