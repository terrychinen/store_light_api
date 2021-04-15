import { Router } from 'express';
import { getInputs, createInput, getInputDetail, updateInput, searchInput, searchInputByDate, getInputDetailByDate, 
            searchInputByCommodity, searchInputByOrder, getInputsPhone, getInput, createInputPhone, 
            createInputDetailPhone, deleteInputDetailPhone, updateInputDetailPhone, updateInputPhone } from '../controllers/input.controller';

const router = Router();


router.route('/')
    .get(getInputs)
    .post(createInput)
    .put(updateInputPhone);

router.route('/:purchase_id')
    .get(getInputDetail)
    .post(getInput)
    .put(updateInput);

router.route('/search')   
    .post(searchInput);


router.route('/phone/create')
    .post(createInputPhone)
    .put(updateInputDetailPhone);    


router.route('/phone/delete/detail')
    .post(deleteInputDetailPhone)


router.route('/phone/create/detail')
    .post(createInputDetailPhone);    

router.route('/phone/order/search')
    .get(getInputsPhone)
    .post(searchInputByOrder);

router.route('/phone/detail/search')
    .get(getInputDetailByDate)
    .post(searchInputByCommodity);

router.route('/search/bydate')
    .post(searchInputByDate);           

export default router;