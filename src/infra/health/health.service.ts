import { Injectable } from '@nestjs/common';
import { HealthCheckResult, HealthResult } from './schemas/health.schemas';
import { HealthRegistryService } from './services/registry.service';
import { HealthCheckError } from 'src/core/erros/health.error';

@Injectable()
export class HealthService {
  private readonly serverStartTime = Date.now();

  constructor(private readonly registry: HealthRegistryService) {}

  private getChecks() {
    return this.registry.getChecks();
  }

  async check(): Promise<HealthResult> {
    const checkList = this.getChecks();

    const checkEntries = await Promise.all(
      checkList.map(async (check) => {
        const result = await check.check();
        return [check.name, result];
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const checks: Record<string, HealthCheckResult> =
      Object.fromEntries(checkEntries);

    let globalStatus: 'ok' | 'unavailable' | 'degraded' = 'ok';

    const dbStatus = checks['database'].status;

    if (dbStatus !== 'ok') {
      globalStatus = 'unavailable';
    } else {
      const hasSecondaryFailures = Object.entries(checks).some(
        ([name, result]) => name !== 'database' && result.status !== 'ok',
      );

      if (hasSecondaryFailures) {
        globalStatus = 'degraded';
      }
    }
    const uptime = Math.floor((Date.now() - this.serverStartTime) / 1000);

    const messageReturn: HealthResult = {
      status: globalStatus,
      timestamp: new Date().toISOString(),
      uptime,
      checks,
    };

    if (globalStatus === 'unavailable') {
      throw new HealthCheckError(messageReturn);
    }

    return messageReturn;
  }
}
