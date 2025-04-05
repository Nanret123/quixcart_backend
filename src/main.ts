import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Every endpoint should start with api
  app.setGlobalPrefix('api');

  // Enable versioning globally
  app.enableVersioning({
    type: VersioningType.URI, // Versioning in the URL (e.g., /v1/route, /v2/route)
    defaultVersion: '1',
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API Documentation')
    .setDescription('API Documentation for QuixCart Ecommerce Store')
    .setVersion('1.0')
    .addTag('ecommerce')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to be objects of the DTO classes
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if any non-whitelisted properties are found
    }),
  );

  const logger = new Logger('Bootstrap');
  // Register the filter globally
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
