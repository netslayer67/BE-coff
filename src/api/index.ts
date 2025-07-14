import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import productRoutes from './products/product.routes';
import orderRoutes from './orders/order.routes';
import userRoutes from './users/user.routes';
import tableRoutes from './tables/table.routes'; // <-- Tambahkan ini
import customerRoutes from './customer/customer.routes'; // <-- Tambahkan ini
import paymentRoutes from './payments/payment.routes'; // <-- Tambahkan ini

const router = Router();

// Rute untuk setiap modul API
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/tables', tableRoutes); // <-- Daftarkan di sini
router.use('/customer', customerRoutes); // <-- Daftarkan di sini
router.use('/payments', paymentRoutes); // <-- Daftarkan di sini

export default router;