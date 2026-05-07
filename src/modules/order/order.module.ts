import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';

@Module({
  imports: [InfraModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
