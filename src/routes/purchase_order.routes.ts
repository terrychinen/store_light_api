import { Router } from 'express';
import { getPurchaseOrders, getPurchaseOrdersWithState, getPurchaseOrderDetail, updatePurchaseOrder, createPurchaseOrder } from '../controllers/purcharse_order';

const router = Router();


router.route('/')
    .get(getPurchaseOrders)
    .post(createPurchaseOrder);
 

router.route('/:purchase_id')
    .get(getPurchaseOrderDetail) 
    .put(updatePurchaseOrder);   


router.route('/with_state')
    .get(getPurchaseOrdersWithState)


export default router;