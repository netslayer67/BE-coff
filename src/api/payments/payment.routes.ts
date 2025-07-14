import { Router } from 'express';
import { createTransactionController, notificationController } from './payment.controller';

const router = Router();

// Endpoint untuk frontend meminta token pembayaran
router.post('/create-transaction', createTransactionController);

// Endpoint untuk Midtrans mengirim notifikasi (webhook)
router.post('/notification', notificationController);

export default router;