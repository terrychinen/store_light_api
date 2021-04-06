import { Router } from 'express';
import { getStoresCommodities, getCommoditiesByStoreID, getCommodityByStoreIDAndCommdotyId, 
            createStoreCommodity, updateStoreCommodity, 
            getStoresCommoditiesWithStockMin, getAllCommoditiesByStoreIDAndCommodityID, searchStoreCommodity,
            getByStoreIdCommodityId } from '../controllers/store_commodity.controller';

const router = Router();


router.route('/')
    .get(getStoresCommodities)
    .post(createStoreCommodity)
    .put(updateStoreCommodity);

    
router.route('/:store_id')
    .post(getCommoditiesByStoreID);
 
    
router.route('/stock/:store_id/:commodity_id')
    .post(getCommodityByStoreIDAndCommdotyId);

     
router.route('/store/category/:store_id/:category_id')
    .get(getAllCommoditiesByStoreIDAndCommodityID);


router.route('/stock_min')
    .get(getStoresCommoditiesWithStockMin);

router.route('/search/commodity')
    .post(searchStoreCommodity);


router.route('/phone/check/by')
    .get(getByStoreIdCommodityId);

export default router;