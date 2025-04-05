/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from 'src/database/schemas/address.schema';
import { Order } from 'src/database/schemas/order.schema';
import { Product } from 'src/database/schemas/product.schema';
import { ICreateOrder } from './dto/index.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private order: Model<Order>,
    @InjectModel(Product.name) private product: Model<Product>,
    @InjectModel(Address.name) private address: Model<Address>,
  ) {}

  //create order
  async createOrder(payload: ICreateOrder) {
    const { user, body } = payload;
    const { products, shippingAddressId } = body;

    // Validate products
    const productIds = products.map((p) => p.productId);
    const dbProducts = await this.product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== products.length) {
      throw new BadRequestException('One or more products are invalid');
    }

    //validate addressid
    const isAddress = await this.address.findById(shippingAddressId);
    if (!isAddress) {
      throw new NotFoundException('Shipping address not found');
    }

    // Calculate total price and tax
    const taxRate = 0.1; // 10% tax rate
    let totalPrice = 0;

    const orderProducts = products.map((p) => {
      const product = dbProducts.find(
        (prod) => prod._id.toString() === p.productId,
      );
      const subtotal = p.quantity * product!.price;
      totalPrice += subtotal;
      return {
        productId: p.productId,
        price: product!.price,
        quantity: p.quantity,
      };
    });

    const taxAmount = totalPrice * taxRate;
    const finalPrice = totalPrice + taxAmount;

    // Create order
    const newOrder = new this.order({
      user,
      products: orderProducts,
      totalPrice: finalPrice,
      taxAmount,
      shippingAddress: shippingAddressId,
    });

    return newOrder.save();
  }

  //get all user orders
  async getUserOrders({ userId }: { userId: string }) {
    const userOrders = await this.order.find({ user: userId }).exec();

    if (userOrders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }

    return {
      message: 'User orders fetched successfully',
      orders: userOrders,
    };
  }

  //get all orders
  async getAllOrders() {
    const allOrders = await this.order.find().exec();

    return {
      message: 'All orders fetched successfully',
      orders: allOrders,
    };
  }

  //get order by id
  async getOrderById({ orderId }: { orderId: string }) {
    const order = await this.order
      .findById(orderId)
      .populate('products.productId')
      .populate('shippingAddress')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      message: 'Order fetched successfully',
      order,
    };
  }

  //cancel an order if it hasnt been shipped yet
  async cancelOrder({ orderId, userId }: { orderId: string; userId: string }) {
    const order = await this.order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      throw new BadRequestException(
        'Order cannot be cancelled as it has already been shipped or delivered.',
      );
    }

    order.status = 'cancelled';
    await order.save();

    return { message: 'Order cancelled successfully', order };
  }

  //update order status
  async updateOrderStatus({
    orderId,
    status,
  }: {
    orderId: string;
    status: string;
  }) {
    const order = await this.order
      .findByIdAndUpdate(orderId, { status }, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { message: 'Order status updated successfully', order };
  }

  //delete an order
  async deleteOrder({ orderId }: { orderId: string }) {
    const order = await this.order.findByIdAndDelete(orderId).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { message: 'Order deleted successfully' };
  }
}
