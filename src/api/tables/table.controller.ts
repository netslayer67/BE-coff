import { Request, Response, NextFunction } from 'express';
import * as tableService from './table.service';
import { ApiError } from '../../utils/apiError';

/**
 * Controller cerdas untuk membuat satu atau banyak meja.
 * Ia akan memeriksa apakah req.body berupa objek tunggal atau array.
 */
export const createTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        // Skenario 1: Jika body adalah array (untuk membuat banyak meja)
        if (Array.isArray(body)) {
            // Validasi sederhana tanpa Zod
            if (body.length === 0) {
                throw new ApiError(400, "Request body tidak boleh berupa array kosong.");
            }
            const tablesData = body.map(item => {
                if (!item.tableNumber || typeof item.tableNumber !== 'string') {
                    throw new ApiError(400, "Setiap objek dalam array harus memiliki 'tableNumber' berupa string.");
                }
                return { tableNumber: item.tableNumber };
            });

            const tables = await tableService.createMultipleTables(tablesData);
            return res.status(201).json({ message: `${tables.length} meja berhasil dibuat.`, tables });
        }
        
        // Skenario 2: Jika body adalah objek tunggal
        else if (typeof body === 'object' && body !== null) {
            if (!body.tableNumber || typeof body.tableNumber !== 'string') {
                throw new ApiError(400, "Request body harus memiliki 'tableNumber' berupa string.");
            }
            const table = await tableService.createTable(body.tableNumber);
            return res.status(201).json(table);
        }

        // Jika format body tidak sesuai
        throw new ApiError(400, "Format request body tidak valid. Kirimkan objek tunggal atau array berisi objek.");

    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan semua meja (tidak ada perubahan).
 */
export const getTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tables = await tableService.getAllTables();
        res.status(200).json(tables);
    } catch (error) {
        next(error);
    }
};