import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err); 

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }

    // Untuk error yang tidak terduga
    return res.status(500).json({
        message: 'Terjadi kesalahan pada server',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};