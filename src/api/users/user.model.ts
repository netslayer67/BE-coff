import { Schema, model } from 'mongoose';
import { IUser } from '../../interfaces/User';

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['cashier', 'admin'], default: 'cashier' },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);