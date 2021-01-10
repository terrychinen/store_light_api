import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, searchCategory } from '../controllers/category.controller';

const router = Router();


router.route('/')
    .get(getCategories)
    .post(createCategory);


router.route('/:category_id')
    .put(updateCategory)
    .delete(deleteCategory);


router.route('/search')
    .post(searchCategory);


export default router;