import { Router } from 'express';
import { getTables, createTables } from './table.controller';
import { protect, adminOnly } from '../../middleware/auth.middleware';

const router = Router();

router.route('/')
    .get(getTables)
    .post(protect, adminOnly, createTables); // <-- Satu endpoint untuk semua skenario create

export default router;