import mongoose, { Schema, Model } from 'mongoose';

export interface IPortfolio {
  _id?: string;
  imageUrl: string;
  title?: string;
  description?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
