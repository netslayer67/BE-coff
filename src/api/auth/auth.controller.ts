import { Request, Response, NextFunction } from 'express';
import { registerCashier, loginCashier } from './auth.service';
import { registerSchema, loginSchema } from './auth.validation'; // <-- Impor skema

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validasi input menggunakan skema Zod
        const { name, email, password } = registerSchema.parse(req).body;

        const user = await registerCashier({ name, email, password });
        res.status(201).json({ message: 'Registrasi kasir berhasil', user });
    } catch (error) {
        // Zod akan melempar error jika validasi gagal, yang akan ditangkap di sini
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validasi input menggunakan skema Zod
        const { email, password } = loginSchema.parse(req).body;

        const { token, user } = await loginCashier({ email, password });
        res.status(200).json({ token, user });
    } catch (error) {
        next(error);
    }
};