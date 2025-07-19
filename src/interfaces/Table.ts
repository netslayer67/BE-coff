import { Document } from 'mongoose';

export interface ITable extends Document {
  tableNumber: string;
}