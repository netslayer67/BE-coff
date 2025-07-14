import Table from './table.model';
import { ITable } from '../../interfaces/Table';
import { ApiError } from '../../utils/apiError';

// Service untuk membuat meja baru (oleh admin)
export const createTable = async (tableNumber: string): Promise<ITable> => {
  const existingTable = await Table.findOne({ tableNumber });
  if (existingTable) {
    throw new ApiError(409, `Meja dengan nomor ${tableNumber} sudah ada.`);
  }
  const newTable = new Table({ tableNumber });
  await newTable.save();
  return newTable;
};

// Service untuk mendapatkan semua meja (untuk pelanggan dan kasir)
export const getAllTables = async (): Promise<ITable[]> => {
  return Table.find().sort({ tableNumber: 1 });
};

// Service untuk mengubah status ketersediaan meja
export const updateTableAvailability = async (id: string, isAvailable: boolean): Promise<ITable> => {
    const table = await Table.findByIdAndUpdate(id, { isAvailable }, { new: true });
    if (!table) {
        throw new ApiError(404, 'Meja tidak ditemukan');
    }
    return table;
}

export const createMultipleTables = async (tables: { tableNumber: string }[]): Promise<ITable[]> => {
  try {
    // Menggunakan insertMany untuk efisiensi, ini hanya 1x panggilan ke database
    const newTables = await Table.insertMany(tables, { ordered: false });
    return newTables;
  } catch (error: any) {
    // Menangani error jika ada nomor meja duplikat
    if (error.code === 11000) {
      throw new ApiError(409, "Beberapa nomor meja sudah ada dan tidak dapat ditambahkan.");
    }
    throw error;
  }
};