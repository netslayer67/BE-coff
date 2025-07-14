import { Request, Response, NextFunction } from 'express';
import { createProduct, getProducts } from './product.service';
import { ApiError } from '../../utils/apiError';

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new ApiError(400, 'Gambar produk diperlukan');
        }
        const product = await createProduct(req.body, req.file);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};