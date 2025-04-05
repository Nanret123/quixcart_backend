import { Controller, Post, Req, Res } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly service: WebhooksService) {}

  @ApiOperation({
    summary: 'Handle Flutterwave payment webhook',
    description: 'Handle Flutterwave payment webhook to update order status',
  })
  @Post('payment')
  orderPaymentWebhook(@Req() req, @Res() res) {
    return this.service.orderPaymentWebhook({ req, res });
  }
}
