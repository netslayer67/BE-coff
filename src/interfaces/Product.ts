import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'specialty' | 'cold' | 'pastry' | 'other';
  imageUrl: string;
  isPopular: boolean;
  prepTime: string;
  rating: number;
}