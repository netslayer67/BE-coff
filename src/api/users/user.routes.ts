import { Router } from 'express';
import { getUsers, getSingleUser, deleteUser } from './user.controller';
import { protect, adminOnly } from '../../middleware/auth.middleware';

const router = Router();

// Semua rute di bawah ini dilindungi dan hanya untuk admin
router.use(protect, adminOnly);

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getSingleUser)
    .delete(deleteUser);

export default router;