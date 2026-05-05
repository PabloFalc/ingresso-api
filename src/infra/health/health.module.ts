import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { HealthRegistryService } from './services/registry.service';
import { MemoryHealthService } from './services/memory.health';

@Module({
  providers: [HealthService, HealthRegistryService, MemoryHealthService],
  controllers: [HealthController],
  exports: [HealthRegistryService],
})
export class HealthModule {}
