import { Router } from 'express';
import { startSession } from './customer.controller';

const router = Router();

router.post('/start-session', startSession);

export default router;