import Order from './order.model';
// import { updateTableAvailability } from '../tables/table.service';
import { IOrder } from '../../interfaces/Order';
import { getSocketIO } from '../../services/socket.service';
import { ApiError } from '../../utils/apiError';
import { v4 as uuidv4 } from 'uuid'; // <-- 1. Impor uuid

// Interface untuk data yang masuk
interface CreateOrderInput {
  customerName: string;
  orderType: 'dine-in' | 'take away';
  table?: string;
  items: { product: string; quantity: number; price: number }[];
  description?: string;
  subtotal: number;
}

const TAX_RATE = 0.11; // Definisikan PPN 11%

const generateOrderNumber = (): string => {
    return `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
};

export const createNewOrder = async (orderData: CreateOrderInput): Promise<IOrder> => {
    // --- LOGIKA BARU DI SINI ---
    const { subtotal } = orderData;
    const taxAmount = subtotal * TAX_RATE;
    const total = subtotal + taxAmount;

    try {
        const generatedOrderNumber = generateOrderNumber();
        
        const newOrder = new Order({ 
            ...orderData, 
            orderNumber: generatedOrderNumber,
            taxAmount,
            total,
        });
        
        await newOrder.save();
        // Populate data setelah menyimpan
        await newOrder.populate([
            { path: 'items.product', select: 'name imageUrl' },
            { path: 'table', select: 'tableNumber' }
        ]);

        const io = getSocketIO();
        io.emit('new_order', newOrder); 

        return newOrder;
    } catch (error) {
        // Karena tidak ada interaksi meja, penanganan error menjadi lebih sederhana
        console.error("Gagal membuat pesanan baru:", error);
        throw error;
    }
};


export const getAllOrders = async () => {
    // Ambil pesanan hari ini dan populate data yang dibutuhkan
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
        .populate('items.product', 'name') // Hanya ambil nama produk
        .populate('table', 'tableNumber')  // Hanya ambil nomor meja
        .sort({ createdAt: -1 });
};


export const updateOrderStatus = async (orderId: string, status: IOrder['status']) => {
    // Cari dan perbarui pesanan
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
        throw new Error('Pesanan tidak ditemukan');
    }

    // --- PERBAIKAN UTAMA DI SINI ---
    // Setelah update, populate kembali semua relasi yang dibutuhkan oleh frontend
    await order.populate([
        { path: 'table', select: 'tableNumber' },
        { path: 'items.product', select: 'name' }
    ]);

    // Kirim pembaruan real-time ke semua klien
    const io = getSocketIO();
    io.emit('order_status_update', order);

    return order;
};

export const getOrderStatusForCustomer = async(orderId: string): Promise<IOrder> => {
    // Log untuk debugging, untuk memastikan kita menerima ID yang benar
    console.log(`Mencari pesanan dengan ID: ${orderId}`);

    // Gunakan try-catch untuk menangani potensi error konversi ID
    try {
        const order = await Order.findById(orderId).populate([
            { path: 'table', select: 'tableNumber' },
            { path: 'items.product', select: 'name imageUrl' }
        ]);

        if (!order) {
            // Jika findById mengembalikan null, lemparkan error 404
            throw new ApiError(404, 'Pesanan tidak ditemukan di database.');
        }
        
        return order;
    } catch (error) {
        // Tangani error jika string ID tidak valid untuk diubah menjadi ObjectID
        if (error instanceof Error && error.name === 'CastError') {
            console.error(`Error konversi ID: ${orderId} bukan ObjectID yang valid.`);
            throw new ApiError(400, 'Format ID Pesanan tidak valid.');
        }
        // Lemparkan kembali error asli jika bukan CastError
        throw error;
    }
};