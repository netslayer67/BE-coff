import { z } from 'zod';

// Skema untuk satu item di dalam keranjang
const orderItemSchema =z.object({
  product: z.string().nonempty("ID Produk tidak boleh kosong"),
  quantity: z.number().min(1, "Kuantitas minimal adalah 1")
    .refine(val => typeof val === 'number', {
      message: "Kuantitas harus berupa angka"
    }),
  price: z.number().refine(val => typeof val === 'number', {
    message: "Harga harus berupa angka"
  }),
});

// Skema utama untuk membuat pesanan baru
export const createOrderSchema = z.object({
  customerName: z.string().nonempty("Nama pelanggan tidak boleh kosong"),
  
  orderType: z.enum(['dine-in', 'take away'], {
      // This is the correct parameter for a custom error message
      // for when the value is not one of the enum members.
      message: "Tipe pesanan harus 'dine-in' atau 'take away'",
    }),
  
  items: z.array(orderItemSchema).min(1, "Pesanan harus memiliki minimal 1 item"),
  
  subtotal: z.number().min(0, "Subtotal tidak boleh negatif"),
  
  table: z.string().optional(),
  
  description: z.string().optional(),

}).refine(data => {
  // Validasi kondisional: jika orderType adalah 'dine-in', 'table' wajib diisi.
  if (data.orderType === 'dine-in') {
    return !!data.table && data.table.length > 0;
  }
  return true;
}, {
  // Pesan error jika validasi kondisional gagal
  message: "Nomor meja wajib diisi untuk pesanan dine-in",
  path: ["table"], // Menunjukkan bahwa error ini terjadi pada field 'table'
});