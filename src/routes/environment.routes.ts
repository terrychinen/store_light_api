import { Router } from 'express';
import { getEnvironments, createEnvironment, updateEnvironment, deleteEnvironment, searchEnvironment } from '../controllers/environment.controller';

const router = Router();


router.route('/')
    .get(getEnvironments)
    .post(createEnvironment);


router.route('/:environment_id')
    .put(updateEnvironment)
    .delete(deleteEnvironment);


router.route('/search')
    .post(searchEnvironment);


export default router;