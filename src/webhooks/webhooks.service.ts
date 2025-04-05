/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/database/schemas/order.schema';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Order.name) private order: Model<Order>,
  ) {}
  //order payment
  async orderPaymentWebhook({ req, res }) {
    try {
      const secretHash = this.configService.get<string>('FLW_SECRET_HASH'); // Set this in .env
      const signature = req.headers['verif-hash']; // Flutterwave sends this

      if (!signature || signature !== secretHash) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const event = req.body;
      if (event.event === 'charge.completed') {
        const paymentStatus = event.data.status;
        const transactionId = event.data.id;
        const userEmail = event.data.customer.email;

        if (paymentStatus === 'successful') {
          // Assuming `orderId` or `paymentReference` exists in the event data
          const order = await this.order.findOne({
            paymentReference: transactionId,
          });

          if (!order) {
            console.error(
              `Order not found for transaction ID: ${transactionId}`,
            );
            return res.status(404).json({ message: 'Order not found' });
          }

          // Update order payment status in the DB
          order.paymentStatus = 'paid';
          order.paymentReference = transactionId;
          await order.save();

          console.log(
            `Payment successful for ${userEmail} - Transaction ID: ${transactionId}`,
          );
        } else {
          console.log(
            `Payment failed or pending for Transaction ID: ${transactionId}`,
          );
        }

        // Respond with a 200 status after processing the webhook
        return res.status(200).send('Webhook processed successfully');
      } else {
        console.log('Webhook event is not charge.completed');
        return res.status(200).send('Event ignored');
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
