import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ApiError } from '../utils/apiError';

interface AuthRequest extends Request {
    user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError(401, 'Tidak ada token, otorisasi ditolak'));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as any;
        req.user = decoded.user;
        next();
    } catch (error) {
        next(new ApiError(401, 'Token tidak valid'));
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        next(new ApiError(403, 'Akses ditolak, hanya untuk admin'));
    }
};