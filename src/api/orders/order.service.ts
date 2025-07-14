import Order from './order.model';
import { updateTableAvailability } from '../tables/table.service';
import { IOrder } from '../../interfaces/Order';
import { getSocketIO } from '../../services/socket.service';
import { ApiError } from '../../utils/apiError';

interface CreateOrderInput extends Omit<IOrder, 'orderNumber' | 'status' | 'createdAt' | 'updatedAt' | 'id'> {
    // Tipe ini akan membantu kita
}

const generateOrderNumber = async () => {
    const today = new Date();
    const datePrefix = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    const lastOrder = await Order.findOne({ orderNumber: new RegExp(`^${datePrefix}`) }).sort({ createdAt: -1 });
    let sequence = 1;
    if (lastOrder) {
        sequence = parseInt(lastOrder.orderNumber.slice(-4)) + 1;
    }
    return `${datePrefix}-${sequence.toString().padStart(4, '0')}`;
};

export const createNewOrder = async (orderData: CreateOrderInput) => {
    const { table } = orderData;
    
    // 1. Panggil service untuk mengunci meja
    await updateTableAvailability(table.toString(), false);

    try {
        const orderNumber = await generateOrderNumber();
        const newOrder = new Order({ ...orderData, orderNumber });
        await newOrder.save();
        await newOrder.populate(['items.product', 'table']);

        // 2. Kirim notifikasi real-time ke kasir
        const io = getSocketIO();
        io.emit('new_order', newOrder); 

        return newOrder;
    } catch (error) {
        // 3. Jika gagal membuat pesanan, buka kembali kunci meja
        await updateTableAvailability(table.toString(), true);
        throw error; // Lemparkan error agar bisa ditangani lebih lanjut
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