import { Schema, model } from 'mongoose';
import { IProduct } from '../../interfaces/Product';

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['coffee', 'specialty', 'cold', 'pastry', 'other'], required: true },
  imageUrl: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
  prepTime: { type: String },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default model<IProduct>('Product', ProductSchema);