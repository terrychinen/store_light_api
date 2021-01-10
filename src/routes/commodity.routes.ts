import { Router } from 'express';
import { getCommodities, createCommodity, updateCommodity, deleteCommodity, searchCommodity } from '../controllers/commodity.controller';

const router = Router();


router.route('/')
    .get(getCommodities)
    .post(createCommodity);


router.route('/:commodity_id')
    .put(updateCommodity)
    .delete(deleteCommodity);


router.route('/search')
    .post(searchCommodity);


export default router;