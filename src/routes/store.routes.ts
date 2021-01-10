import { Router } from 'express';
import { getStores, createStore, updateStore, deleteStore, searchStore } from '../controllers/store.controller';

const router = Router();


router.route('/')
    .get(getStores)
    .post(createStore);


router.route('/:store_id')
    .put(updateStore)
    .delete(deleteStore);


router.route('/search')
    .post(searchStore);


export default router;