import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { betterAuthModule } from 'src/core/shared/better-auth.module';

@Module({
  imports: [betterAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
