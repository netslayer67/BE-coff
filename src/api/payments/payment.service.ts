import Order from '../orders/order.model';
import { ApiError } from '../../utils/apiError';
import { getSocketIO } from '../../services/socket.service';
import midtransClient from 'midtrans-client';
import config from '../../config';

const TAX_RATE = 0.11; // Pajak PPN 11%

// Inisialisasi Snap API dari Midtrans
const snap = new midtransClient.Snap({
    isProduction: config.midtrans.isProduction,
    serverKey: config.midtrans.serverKey,
    clientKey: config.midtrans.clientKey,
});

/**
 * Fungsi baru untuk membuat transaksi Midtrans.
 * Fungsi ini akan dipanggil oleh pelanggan dari frontend untuk mendapatkan token pembayaran.
 */
export const createMidtransTransaction = async (orderId: string) => {
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
        throw new ApiError(404, 'Pesanan tidak ditemukan');
    }
    if (order.paymentStatus === 'paid') {
        throw new ApiError(400, 'Pesanan ini sudah dibayar.');
    }

    // 1. Kalkulasi final
    const subtotal = order.subtotal;
    const taxAmount = subtotal * TAX_RATE;
    const totalPaid = subtotal + taxAmount;
    
    // Simpan perhitungan pajak ke order (opsional, tapi bagus untuk data)
    order.taxAmount = taxAmount;
    order.total = totalPaid;
    await order.save();

    // 2. Siapkan parameter untuk Midtrans
    const parameter = {
        transaction_details: {
            order_id: order.id, // Gunakan ID unik dari database Anda
            gross_amount: Math.round(totalPaid), // Midtrans memerlukan integer
        },
        item_details: [
            // Tambahkan item dari pesanan Anda
            ...order.items.map((item: any) => ({
                id: item.product._id.toString(),
                price: Math.round(item.price),
                quantity: item.quantity,
                name: item.product.name.substring(0, 50), // Nama item maks 50 char
            })),
            // Tambahkan Pajak sebagai item terpisah
            {
                id: 'TAX',
                price: Math.round(taxAmount),
                quantity: 1,
                name: 'PPN 11%',
            },
        ],
        customer_details: {
            first_name: order.customerName,
            // Anda bisa menambahkan email atau nomor telepon jika ada
        },
    };

    // 3. Buat transaksi menggunakan Snap API
    const transaction = await snap.createTransaction(parameter);

    // 4. Kirim token transaksi kembali ke frontend
    return transaction;
};


/**
 * Fungsi baru untuk menangani notifikasi webhook dari Midtrans.
 * Midtrans akan memanggil endpoint ini setelah status pembayaran berubah.
 */
export const handleMidtransNotification = async (notification: any) => {
    const { order_id, transaction_status, fraud_status, transaction_id } = notification;

    // 1. Dapatkan status transaksi dari notifikasi
    const order = await Order.findById(order_id);
    if (!order) {
        // Jika pesanan tidak ditemukan, abaikan notifikasi
        console.warn(`Webhook: Pesanan dengan ID ${order_id} tidak ditemukan.`);
        return;
    }
    
    // 2. Lakukan update berdasarkan status transaksi
    if (transaction_status == 'capture') {
        if (fraud_status == 'accept') {
            // Pembayaran berhasil
            order.paymentStatus = 'paid';
            order.transactionId = transaction_id;
            // Jika pesanan sudah 'ready', selesaikan
            if (order.status === 'ready') {
                order.status = 'completed';
            }
        }
    } else if (transaction_status == 'settlement') {
        // Pembayaran berhasil dan dana sudah masuk
        order.paymentStatus = 'paid';
        order.transactionId = transaction_id;
        if (order.status === 'ready') {
            order.status = 'completed';
        }
    } else if (transaction_status == 'cancel' ||
               transaction_status == 'deny' ||
               transaction_status == 'expire') {
        // Pembayaran gagal
        order.paymentStatus = 'failed';
    } else if (transaction_status == 'pending') {
        // Pembayaran masih menunggu
        order.paymentStatus = 'pending';
    }
    
    await order.save();
    console.log(`Webhook: Status pesanan ${order.id} diperbarui menjadi ${order.paymentStatus}`);
    
    // Kirim notifikasi real-time ke kasir
    const io = getSocketIO();
    io.emit('payment_update', order);
};
// Fungsi untuk memproses pembayaran
export const processPayment = async (orderId: string, paymentMethod: 'card' | 'qris' | 'cashier') => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, 'Pesanan tidak ditemukan');
    }
    if (order.paymentStatus === 'paid') {
        throw new ApiError(400, 'Pesanan ini sudah dibayar');
    }

    // 1. Kalkulasi final
    const subtotal = order.subtotal;
    const taxAmount = subtotal * TAX_RATE;
    const totalPaid = subtotal + taxAmount;

    let transactionId = `CASH-${order.orderNumber}`;

    // 2. Simulasi proses pembayaran berdasarkan metode
    if (paymentMethod === 'qris' || paymentMethod === 'card') {
        // --- Simulasi Interaksi Payment Gateway ---
        // Di aplikasi nyata, di sini Anda akan memanggil API Midtrans/Stripe/Xendit
        // dan menunggu respons. Jika berhasil, Anda akan mendapatkan ID transaksi.
        console.log(`Mensimulasikan pembayaran via ${paymentMethod.toUpperCase()}...`);
        const isSuccess = true; // Anggap selalu berhasil untuk demo
        if (!isSuccess) {
            order.paymentStatus = 'failed';
            await order.save();
            throw new ApiError(500, 'Pembayaran gagal diproses oleh gateway');
        }
        transactionId = `${paymentMethod.toUpperCase()}-${Date.now()}`;
        console.log(`Pembayaran berhasil dengan ID Transaksi: ${transactionId}`);
        // --- Akhir Simulasi ---
    }
    
    // 3. Update data pesanan
    order.paymentMethod = paymentMethod;
    order.paymentStatus = 'paid';
    order.taxAmount = taxAmount;
    order.total = totalPaid; // Update total akhir dengan pajak
    order.transactionId = transactionId;
    
    // Jika pesanan sudah siap, ubah status jadi 'completed' setelah bayar
    if (order.status === 'ready') {
        order.status = 'completed';
    }
    
    await order.save();
    
    // 4. Kirim notifikasi ke kasir bahwa pesanan telah dibayar
    const io = getSocketIO();
    io.emit('payment_success', order);

    // Populate data untuk dikirim kembali sebagai respons
    await order.populate(['items.product', 'table']);
    return order;
};