import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Documented } from 'src/core/decorators/documented/route-doc.decorator';
import { checkDocument } from './docs/health.doc';

@Controller('/health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Documented(checkDocument)
  @Get('/')
  async check() {
    const result = await this.service.check();
    return result;
  }
}
