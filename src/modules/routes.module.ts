import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './event/events.module';
import { TicketsModule } from './ticket/ticket.module';
import { OrdersModule } from './order/order.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EventsModule,
    TicketsModule,
    OrdersModule,
    TicketsModule,
  ],
})
export class RoutesModule {}
