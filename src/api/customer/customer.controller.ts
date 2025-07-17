import { Request, Response, NextFunction } from 'express';
import Table from '../tables/table.model';
import { ApiError } from '../../utils/apiError';
import { startSessionSchema } from './customer.validation';

export const startSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // --- PERBAIKAN DI SINI ---
        // Panggil .parse() pada req.body secara langsung
        const { customerName, tableId } = startSessionSchema.parse(req.body);

        const table = await Table.findById(tableId);

        if (!table) {
            throw new ApiError(404, 'Meja tidak ditemukan.');
        }

        if (!table.isAvailable) {
            throw new ApiError(409, 'Meja ini sedang digunakan. Silakan pilih meja lain.');
        }

        res.status(200).json({
            message: 'Validasi berhasil, silakan lanjutkan ke menu.',
            sessionData: {
                customerName,
                tableId: table._id,
                tableNumber: table.tableNumber
            }
        });

    } catch (error) {
        next(error);
    }
};