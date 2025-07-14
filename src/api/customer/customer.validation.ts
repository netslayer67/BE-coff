import { z } from 'zod';

export const startSessionSchema = z.object({
  body: z.object({
    customerName: z.string().nonempty('Nama pelanggan tidak boleh kosong'),
    tableId: z.string().nonempty('ID Meja tidak boleh kosong'),
  }),
});