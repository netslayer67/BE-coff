import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service';
import { createOrderSchema } from './order.validation'; // <-- 1. Impor skema validasi

// Controller untuk membuat pesanan baru
export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 2. Validasi req.body menggunakan skema Zod
        const validatedData = createOrderSchema.parse(req.body);

        // 3. Kirim data yang sudah tervalidasi ke service
        const order = await orderService.createNewOrder(validatedData);
        
        res.status(201).json(order);
    } catch (error) {
        // Jika validasi gagal, Zod akan melempar error
        // yang akan ditangkap dan ditangani oleh errorHandler.
        next(error);
    }
};

// Controller untuk mengambil semua pesanan (tidak ada perubahan)
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Controller untuk memperbarui status pesanan (tidak ada perubahan)
export const patchOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(id, status);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// Controller untuk pelanggan melihat status pesanan (tidak ada perubahan)
export const getCustomerOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderService.getOrderStatusForCustomer(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}