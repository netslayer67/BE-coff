import { Schema, model } from 'mongoose';
import { ITable } from '../../interfaces/Table';

const TableSchema = new Schema<ITable>({
  tableNumber: { type: String, required: true, unique: true, trim: true },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export default model<ITable>('Table', TableSchema);