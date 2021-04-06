import { Router } from 'express';
import { getOutputs, createOutput, updateOutput, updateStock, searchOutput, searchOutputByDate, getOutputsByDate } from '../controllers/output.controller';

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

router.route('/phone/search')
    .get(getOutputsByDate)
    .post(searchOutputByDate);


export default router;