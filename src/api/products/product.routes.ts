import { Router } from 'express';
import { addProduct, getAllProducts } from './product.controller';
import { protect, adminOnly } from '../../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
    .get(getAllProducts)
    .post(protect, adminOnly, upload.single('image'), addProduct);

export default router;