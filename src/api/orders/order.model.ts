import { Schema, model } from 'mongoose';
import { IOrder } from '../../interfaces/Order';

const OrderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
}, { _id: false }); // No separate _id for subdocuments

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  orderType: { type: String, enum: ['dine-in', 'take away'], required: true }, // <-- TAMBAHKAN INI
  table: { type: Schema.Types.ObjectId, ref: 'Table' }, // <-- Hapus 'required: true'
  items: [OrderItemSchema],
  description: { type: String }, // <-- TAMBAHKAN INI
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['va', 'qris', 'cashier'] }, // <-- UBAH INI
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  transactionId: { type: String },
}, { timestamps: true });

export default model<IOrder>('Order', OrderSchema);