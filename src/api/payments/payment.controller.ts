import { Request, Response, NextFunction } from 'express';
import { createMidtransTransaction, handleMidtransNotification } from './payment.service';
import { ApiError } from '../../utils/apiError';

// Controller untuk membuat transaksi dan mendapatkan token
export const createTransactionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            throw new ApiError(400, 'ID Pesanan diperlukan');
        }
        const transaction = await createMidtransTransaction(orderId);
        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};

// Controller untuk menangani notifikasi webhook dari Midtrans
export const notificationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Midtrans mengirim notifikasi sebagai body dari POST request
        const notification = req.body;
        await handleMidtransNotification(notification);
        
        // Kirim respons 200 OK agar Midtrans tahu notifikasi sudah diterima
        res.status(200).send('OK');
    } catch (error) {
        next(error);
    }
};