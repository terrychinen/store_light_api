import { Router } from 'express';
import { getPurchaseOrders, getPurchaseOrdersWithState, getPurchaseOrderDetail,
     updatePurchaseOrder, createPurchaseOrder, 
     getPurchaseOrderByDatePhone } from '../controllers/purcharse_order';

const router = Router();


router.route('/')
    .get(getPurchaseOrders)
    .post(createPurchaseOrder);
 

router.route('/:purchase_id')
    .get(getPurchaseOrderDetail)
    .put(updatePurchaseOrder);


router.route('/with/state')
    .get(getPurchaseOrdersWithState);


router.route('/phone/search/bydate')
    .get(getPurchaseOrderByDatePhone) 

export default router;