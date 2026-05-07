import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { InfraModule } from 'src/infra/infra.module';
import { EventsController } from './events.controller';

@Module({
  controllers: [EventsController],
  imports: [InfraModule],
  providers: [EventsService],
})
export class EventsModule {}
