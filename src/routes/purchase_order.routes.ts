import { Router } from 'express';
import { getPurchaseOrders, getPurchaseOrderDetail, updatePurchaseOrder, createPurchaseOrder } from '../controllers/purcharse_order';

const router = Router();


router.route('/')
    .get(getPurchaseOrders)
    .post(createPurchaseOrder);


router.route('/:purchase_id')
    .get(getPurchaseOrderDetail) 
    .put(updatePurchaseOrder);   

export default router;