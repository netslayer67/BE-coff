import User from './user.model';
import { IUser } from '../../interfaces/User';
import { ApiError } from '../../utils/apiError';
import bcrypt from 'bcryptjs';

// Service untuk mendapatkan semua user (kasir)
export const getAllUsers = async (): Promise<IUser[]> => {
    return User.find({ role: 'cashier' }).select('-password');
};

// Service untuk mendapatkan detail satu user
export const getUserById = async (id: string): Promise<IUser> => {
    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new ApiError(404, 'User tidak ditemukan');
    }
    return user;
};

// Service untuk menghapus user
export const deleteUserById = async (id:string): Promise<void> => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new ApiError(404, 'User tidak ditemukan');
    }
}

// Catatan: Fungsi `createUser` sudah di-handle oleh `registerCashier` di auth.service.ts
// Namun, jika admin perlu membuat user tanpa password awal, bisa ditambahkan di sini.