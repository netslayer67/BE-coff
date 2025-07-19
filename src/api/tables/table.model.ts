import { Schema, model } from 'mongoose';
import { ITable } from '../../interfaces/Table';

const TableSchema = new Schema<ITable>({
  tableNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  // Properti 'isAvailable' telah dihapus dari sini
}, { timestamps: true });

export default model<ITable>('Table', TableSchema);