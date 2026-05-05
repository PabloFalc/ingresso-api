import { Module } from '@nestjs/common';
import { drizzleClient } from './drizzle-client';
import { DrizzleService } from './drizzle.service';
import { DrizzleHealthService } from './drizzle.health';
import { HealthModule } from '../health/health.module';

@Module({
  providers: [DrizzleService, drizzleClient, DrizzleHealthService],
  exports: [DrizzleService, DrizzleHealthService],
  imports: [HealthModule],
})
export class DatabaseModule {}
