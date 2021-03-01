import { Router } from 'express';
import { getOutputs, createOutput, updateOutput, updateStock, searchOutput } from '../controllers/output.controller';

const router = Router();


router.route('/')
    .get(getOutputs)
    .post(createOutput);

router.route('/:output_id')
    .put(updateOutput);

router.route('/stock/:output_id')
    .put(updateStock);

router.route('/search')
    .post(searchOutput);


export default router;