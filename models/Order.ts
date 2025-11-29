import mongoose, { Schema, Model } from 'mongoose';

export interface IOrder {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  serviceId: string;
  serviceName: string;
  notes?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    serviceId: {
      type: String,
      required: [true, 'Service ID is required'],
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
