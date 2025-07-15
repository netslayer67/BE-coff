import Order from './order.model';
import { updateTableAvailability } from '../tables/table.service';
import { IOrder } from '../../interfaces/Order';
import { getSocketIO } from '../../services/socket.service';
import { ApiError } from '../../utils/apiError';
import { v4 as uuidv4 } from 'uuid'; // <-- 1. Impor uuid

interface CreateOrderInput extends Omit<IOrder, 'orderNumber' | 'status' | 'createdAt' | 'updatedAt' | 'id'> {}

/**
 * Fungsi untuk membuat nomor pesanan unik menggunakan format UUID.
 */
const generateOrderNumber = (): string => {
    // 2. Gunakan uuidv4() untuk membuat ID unik
    const uniqueId = uuidv4();
    // Ambil 8 karakter pertama dan ubah menjadi huruf besar untuk membuatnya lebih pendek dan rapi
    // Contoh: ORD-550E8400
    return `ORD-${uniqueId.slice(0, 8).toUpperCase()}`;
};

export const createNewOrder = async (orderData: CreateOrderInput): Promise<IOrder> => {
    const { table } = orderData;
    
    await updateTableAvailability(table.toString(), false);

    try {
        // 3. Panggil fungsi generateOrderNumber yang baru
        const generatedOrderNumber = generateOrderNumber();
        
        const newOrder = new Order({ 
            ...orderData, 
            orderNumber: generatedOrderNumber 
        });
        
        await newOrder.save();
        await newOrder.populate(['items.product', 'table']);

        const io = getSocketIO();
        io.emit('new_order', newOrder); 

        return newOrder;
    } catch (error) {
        await updateTableAvailability(table.toString(), true);
        throw error; 
    }
};


export const getAllOrders = async () => {
    // Ambil pesanan hari ini saja, urutkan dari yang terbaru
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).populate('items.product').sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId: string, status: IOrder['status']) => {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
        throw new Error('Pesanan tidak ditemukan');
    }

    const io = getSocketIO();
    io.emit('order_status_update', order); // Kirim notifikasi update

    return order;
};

export const getOrderStatusForCustomer = async(orderId: string): Promise<IOrder> => {
    const order = await Order.findById(orderId).populate(['items.product', 'table']);
    if (!order) {
        throw new ApiError(404, 'Pesanan tidak ditemukan');
    }
    return order;
}