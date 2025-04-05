import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;
  @Prop([
    {
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ])
  products: {
    productId: mongoose.Types.ObjectId;
    price: number;
    quantity: number;
  }[];

  @Prop({ required: true })
  totalPrice: number; // Final price including tax

  @Prop({ required: true })
  taxAmount: number; // Tax amount based on taxRate

  @Prop({ required: true, default: 'pending' })
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Prop({ type: String })
  paymentStatus: 'pending' | 'paid' | 'failed';

  @Prop({ type: String })
  paymentReference?: string; // Transaction ID from Flutterwave

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  shippingAddress: mongoose.Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
