import mongoose, { Schema, Model } from 'mongoose';

export interface IService {
  _id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  details: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    details: {
      type: String,
      required: [true, 'Details are required'],
    },
  },
  {
    timestamps: true,
  }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
