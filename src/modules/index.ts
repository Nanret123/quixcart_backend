import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { DatabaseModule } from 'src/database/database.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { MailModule } from 'src/mail/mail.module';
import { ProductModule } from 'src/product/product.module';
import { ReviewModule } from 'src/review/review.module';
import { UserModule } from 'src/user/user.module';

export const modules = [
  ConfigModule.forRoot({
    isGlobal: true, // This makes ConfigService available globally
  }),
  MongooseModule.forRoot(
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce',
  ),
  DatabaseModule,
  UserModule,
  AuthenticationModule,
  MailModule,
  FileUploadModule,
  ProductModule,
  ReviewModule,
];
