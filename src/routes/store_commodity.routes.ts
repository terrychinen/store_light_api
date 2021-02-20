import { Router } from 'express';
import { getStoresCommodities, getCommoditiesByStoreID, getCommodityByStoreIDAndCommdotyId, createStoreCommodity, updateStoreCommodity } from '../controllers/store_commodity.controller';

const router = Router();


router.route('/')
    .get(getStoresCommodities)
    .post(createStoreCommodity)
    .put(updateStoreCommodity);

    
router.route('/:store_id')
    .post(getCommoditiesByStoreID);
 
    router.route('/stock/:store_id/:commodity_id')
    .post(getCommodityByStoreIDAndCommdotyId);

export default router;