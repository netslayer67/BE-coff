import { z } from 'zod';

// Skema sekarang langsung mendefinisikan bentuk dari req.body
export const startSessionSchema = z.object({
  customerName: z.string().nonempty("Nama pelanggan tidak boleh kosong"),
  tableId: z.string().nonempty("ID Meja tidak boleh kosong"),
});