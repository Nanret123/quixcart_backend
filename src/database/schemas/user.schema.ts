import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  profileImage: string;

  @Prop({ maxlength: 200 })
  bio: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordTokenExpires: Date;

  @Prop()
  verifyToken: string;

  @Prop()
  verifyTokenExpires: Date;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
