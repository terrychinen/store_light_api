import { Router } from 'express';
import { getInputs, createInput, getInputDetail, updateInput, searchInput, searchInputByDate, getTodayInputDetail } from '../controllers/input.controller';

const router = Router();


router.route('/')
    .get(getInputs)
    .post(createInput);

router.route('/:purchase_id')
    .get(getInputDetail) 
    .put(updateInput);

router.route('/search')
    .post(searchInput);

router.route('/search/bydate')
    .post(searchInputByDate);
    
router.route('/today/detail/bydate')
    .get(getTodayInputDetail);       

export default router;