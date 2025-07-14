import Product from './product.model';
import imagekit from '../../config/imagekit';
import { IProduct } from '../../interfaces/Product';

export const createProduct = async (productData: Partial<IProduct>, file: Express.Multer.File) => {
    const result = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: '/coffee-shop/products',
    });

    const newProduct = new Product({
        ...productData,
        imageUrl: result.url,
    });
    
    await newProduct.save();
    return newProduct;
};

export const getProducts = async () => {
    return await Product.find().sort({ createdAt: -1 });
};