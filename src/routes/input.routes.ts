import { Router } from 'express';
import { getInputs, createInput, getInputDetail, updateInput, searchInput, searchInputByDate, getInputDetailByDate, 
            searchInputByCommodity, searchInputByOrder, getInputsPhone, getInput, createInputPhone } from '../controllers/input.controller';

const router = Router();


router.route('/')
    .get(getInputs)
    .post(createInput);

router.route('/:purchase_id')
    .get(getInputDetail)
    .post(getInput)
    .put(updateInput);

router.route('/search')   
    .post(searchInput);


router.route('/phone/create')
    .post(createInputPhone);

router.route('/phone/order/search')
    .get(getInputsPhone)
    .post(searchInputByOrder);

router.route('/phone/detail/search')
    .get(getInputDetailByDate)
    .post(searchInputByCommodity);

router.route('/search/bydate')
    .post(searchInputByDate);           

export default router;