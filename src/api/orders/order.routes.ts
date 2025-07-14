import { Router } from 'express';
import { postOrder, getOrders, patchOrderStatus, getCustomerOrderStatus} from './order.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.route('/')
    .post(postOrder)
    .get(protect, getOrders);

router.patch('/:id/status', protect, patchOrderStatus);
// Rute baru khusus untuk pelanggan melihat status pesanannya
router.get('/status/:id', getCustomerOrderStatus);

export default router;