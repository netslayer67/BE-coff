import User from '../users/user.model';
import bcrypt from 'bcryptjs';
// Impor 'jwt' dan juga tipe 'SignOptions' secara spesifik
import jwt, { SignOptions } from 'jsonwebtoken'; 
import config from '../../config';
import { ApiError } from '../../utils/apiError';
import { ILoginInput, IRegisterInput } from './auth.validation';

export const registerCashier = async (input: IRegisterInput) => {
    const { name, email, password } = input;
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(409, 'Email sudah terdaftar');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword, role: 'cashier' });
    await user.save();
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

export const loginCashier = async (input: ILoginInput) => {
    const { email, password } = input;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Email atau password salah');
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
        throw new ApiError(401, 'Email atau password salah');
    }

    const payload = { user: { id: user.id, role: user.role } };

    // --- PERUBAHAN KRUSIAL DI SINI ---
    // 1. Buat objek options secara terpisah.
    // 2. Beri tipe objek ini secara eksplisit sebagai jwt.SignOptions.
    const jwtOptions: SignOptions = {
        expiresIn: 604800
    };

    // 3. Masukkan payload, secret, dan objek options yang sudah pasti benar.
    const token = jwt.sign(payload, config.jwt.secret, jwtOptions);
    // --- AKHIR PERUBAHAN ---

    const userObject = user.toObject();
    delete userObject.password;
    return { token, user: userObject };
};