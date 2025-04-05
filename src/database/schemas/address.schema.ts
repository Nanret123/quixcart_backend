import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  alternatePhoneNumber: string;

  @Prop({ required: true })
  streetName: string;

  @Prop({ required: true })
  nearestLandMark: string;

  @Prop()
  notes: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
