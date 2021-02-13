import { Router } from 'express';
import { getInputs } from '../controllers/input.controller';

const router = Router();


router.route('/')
    .get(getInputs)


export default router;