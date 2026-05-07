import { Module } from '@nestjs/common';
import { TicketsService } from './ticket.service';
import { TicketsController } from './ticket.controller';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  providers: [TicketsService],
  controllers: [TicketsController],
  imports: [InfraModule],
})
export class TicketsModule {}
