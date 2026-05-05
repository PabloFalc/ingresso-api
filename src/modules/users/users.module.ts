import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { InfraModule } from 'src/infra/infra.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  imports: [InfraModule],
  controllers: [UsersController],
})
export class UsersModule {}
