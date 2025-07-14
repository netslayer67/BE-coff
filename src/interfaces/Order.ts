import { Document, Schema } from 'mongoose';
import { IProduct } from './Product';
import { ITable } from './Table';

// Interface untuk item di dalam pesanan
export interface IOrderItem {
  product: Schema.Types.ObjectId | IProduct;
  quantity: number;
  price: number;
}

// Interface utama untuk dokumen Pesanan (Order)
export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  table: Schema.Types.ObjectId | ITable; // <-- Properti 'table' didefinisikan di sini
  items: IOrderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod?: 'card' | 'qris' | 'cashier';
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string;
}