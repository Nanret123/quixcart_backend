import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  oldPrice?: number; // Optional field

  @Prop({ required: true })
  image: string;

  @Prop({ default: false })
  isTrending: boolean;

  @Prop({ required: true })
  color: string;

  @Prop({ min: 0, max: 5, default: 0 })
  averageRating: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] })
  reviews: mongoose.Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
