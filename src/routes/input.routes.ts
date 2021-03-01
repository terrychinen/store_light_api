import { Router } from 'express';
import { getInputs, createInput } from '../controllers/input.controller';

const router = Router();


router.route('/')
    .get(getInputs)
    .post(createInput);



export default router;