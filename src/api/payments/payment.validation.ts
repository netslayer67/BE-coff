import { z } from 'zod';

export const chargeSchema = z.object({
  body: z.object({
    orderId: z.string().nonempty('ID Pesanan tidak boleh kosong'),
      
    paymentMethod: z.enum(['card', 'qris', 'cashier'], {
      // This is the correct parameter for a custom error message
      // for when the value is not one of the enum members.
      message: "Metode pembayaran tidak valid. Pilih 'card', 'qris', atau 'cashier'.",
    }),
  }),
});