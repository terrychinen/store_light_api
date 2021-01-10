import { Router } from 'express';
import { getProviders, createProvider, updateProvider, deleteProvider, searchProvider } from '../controllers/provider.controller';

const router = Router();


router.route('/')
    .get(getProviders)
    .post(createProvider);


router.route('/:provider_id')
    .put(updateProvider)
    .delete(deleteProvider);


router.route('/search')
    .post(searchProvider);


export default router;