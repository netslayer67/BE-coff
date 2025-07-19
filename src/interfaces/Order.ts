import { Document, Schema } from 'mongoose';
import { IProduct } from './Product';
import { ITable } from './Table';

export interface IOrderItem {
  product: Schema.Types.ObjectId | IProduct;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  orderType: 'dine-in' | 'take away'; // <-- TAMBAHKAN INI
  table?: Schema.Types.ObjectId | ITable; // <-- Jadikan opsional
  items: IOrderItem[];
  description?: string; // <-- TAMBAHKAN INI (opsional)
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod?: 'va' | 'qris' | 'cashier'; // <-- UBAH INI
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string;
}