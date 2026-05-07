import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import { OrdersService } from './order.service';
import type { CreateOrdersBody } from './dtos/order.dto';
import { Documented } from 'src/core/decorators/documented/route-doc.decorator';
import {
  cancelOrderDoc,
  createOrderDoc,
  findAllOrdersDoc,
  findOrderByIdDoc,
  payOrderDoc,
} from './schemas/order.schemas';

@Controller({ path: 'orders' })
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Documented(findAllOrdersDoc)
  @Get('')
  async findAllOrders(@Session() session: { user: { id: string } }) {
    return this.service.findAll(session.user.id);
  }

  @Documented(findOrderByIdDoc)
  @Get(':id')
  async findOrderById(
    @Session() session: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.service.findOne(session.user.id, id);
  }

  @Documented(createOrderDoc)
  @Post('')
  async createOrder(
    @Session() session: { user: { id: string } },
    @Body() body: CreateOrdersBody,
  ) {
    return this.service.create(session.user.id, body);
  }

  @Documented(payOrderDoc)
  @Post(':id/pay')
  async payOrder(
    @Session() session: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.service.pay(session.user.id, id);
  }

  @Documented(cancelOrderDoc)
  @Delete(':id')
  async cancelOrder(
    @Session() session: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.service.cancel(session.user.id, id);
  }
}
