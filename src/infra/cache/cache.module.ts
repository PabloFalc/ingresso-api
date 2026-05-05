import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClient } from './redis.client';
import { RedisHealthService } from './redis.health';
import { HealthModule } from '../health/health.module';
import { ICacheClient } from './cache-client.interface';

@Module({
  providers: [
    RedisService,
    redisClient,
    RedisHealthService,
    {
      provide: ICacheClient,
      useExisting: RedisService,
    },
  ],
  exports: [RedisHealthService, ICacheClient],
  imports: [HealthModule],
})
export class CacheModule {}
