import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './event/events.module';

@Module({
  imports: [AuthModule, UsersModule, EventsModule],
})
export class RoutesModule {}
