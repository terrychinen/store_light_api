import { Router } from 'express';
import { getStoresCommodities, getCommoditiesByStoreID, createStoreCommodity, updateStoreCommodity } from '../controllers/store_commodity.controller';

const router = Router();


router.route('/')
    .get(getStoresCommodities)
    .post(createStoreCommodity)
    .put(updateStoreCommodity);

    
router.route('/:store_id')
    .post(getCommoditiesByStoreID);
 


export default router;