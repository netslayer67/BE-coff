import { z } from 'zod';

// Skema untuk membuat satu meja (hanya validasi body)
export const createTableSchema = z.object({
  tableNumber: z.string().nonempty("Nomor meja tidak boleh kosong"),
});

// Skema untuk membuat banyak meja (hanya validasi body)
export const createMultipleTablesSchema = z.array(
  z.object({
    tableNumber: z.string().nonempty("Nomor meja tidak boleh kosong"),
  })
).min(1, "Daftar meja tidak boleh kosong");