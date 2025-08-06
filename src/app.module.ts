import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { modules } from './modules';
import { JwtAuthGuard } from './guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [...modules, AddressModule, OrderModule, WebhooksModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
