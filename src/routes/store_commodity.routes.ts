import { Router } from 'express';
import { getStoresCommodities, createStoreCommodity, updateStoreCommodity } from '../controllers/store_commodity.controller';

const router = Router();


router.route('/')
    .get(getStoresCommodities)
    .post(createStoreCommodity)
    .put(updateStoreCommodity);
 


export default router;