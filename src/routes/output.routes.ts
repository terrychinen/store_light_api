import { Router } from 'express';
import { getOutputs, createOutput, updateOutput, updateStock } from '../controllers/output.controller';

const router = Router();


router.route('/')
    .get(getOutputs)
    .post(createOutput);

router.route('/:output_id')
    .put(updateOutput);

router.route('/stock/:output_id')
    .put(updateStock);


export default router;