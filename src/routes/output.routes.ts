import { Router } from 'express';
import { getOutputs, createOutput } from '../controllers/output.controller';

const router = Router();


router.route('/')
    .get(getOutputs)
    .post(createOutput)


export default router;