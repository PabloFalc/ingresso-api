import { Injectable, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { IHealthChecks } from 'src/infra/health/contracts/health.interface';
import { HealthCheckResult } from 'src/infra/health/schemas/health.schemas';
import { DRIZZLE } from './drizzle-client';
import * as schema from './schemas/index';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { HealthRegistryService } from '../health/services/registry.service';

@Injectable()
export class DrizzleHealthService implements IHealthChecks {
  readonly name: string = 'database';

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly registry: HealthRegistryService,
  ) {}

  onModuleInit(): void {
    this.registry.register(this);
  }

  async check(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      await this.db.execute(sql`SELECT 1`);
      return {
        status: 'ok',
        responseTime: Date.now() - start,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Database halth check failed';

      return {
        status: 'error',
        responseTime: 0,
        error: message,
      };
    }
  }
}
