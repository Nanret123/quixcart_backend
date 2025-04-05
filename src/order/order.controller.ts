import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto, updateStatus } from './dto/index.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}
  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Create a new order for the logged in user',
  })
  @ApiBody({
    description: 'Order details',
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() body: CreateOrderDto, @Req() req) {
    const user = req?.user?.userId;
    const payload = { body, user };
    return this.service.createOrder(payload);
  }

  @Post('/user')
  @ApiOperation({ summary: 'Get all user orders' })
  @ApiResponse({ status: 200, description: 'User orders fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getUserOrders(@Req() req) {
    return this.service.getUserOrders({ userId: req.user.userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'All orders fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getOrders() {
    return this.service.getAllOrders();
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get one order by Id' })
  @ApiResponse({ status: 200, description: 'Order fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('orderId') orderId: string) {
    return this.service.getOrderById({ orderId });
  }

  @Post(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order by Id' })
  @ApiResponse({ status: 200, description: 'Order canceled successfully' })
  @HttpCode(HttpStatus.OK)
  async cancelOrder(@Param('orderId') orderId: string, @Req() req) {
    const userId = req?.user?.userId;
    return this.service.cancelOrder({ orderId, userId });
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status by Id' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: updateStatus,
  ) {
    const { status } = body;
    return this.service.updateOrderStatus({ orderId, status });
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Delete order by Id' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Param('orderId') orderId: string) {
    return this.service.deleteOrder({ orderId });
  }
}
