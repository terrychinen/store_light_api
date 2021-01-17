import { Router } from 'express';
import { getStoresCommodities, createStoreCommodity } from '../controllers/store_commodity.controller';

const router = Router();


router.route('/')
    .get(getStoresCommodities)
    .post(createStoreCommodity);


// router.route('/:employee_id')
//     .put(updateStoreCommodity);


export default router;