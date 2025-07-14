import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

// Controller untuk mendapatkan semua user
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Controller untuk mendapatkan detail satu user
export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Controller untuk menghapus user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userService.deleteUserById(req.params.id);
        res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        next(error);
    }
};