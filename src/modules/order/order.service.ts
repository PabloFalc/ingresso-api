import { Injectable } from '@nestjs/common';
import { ICacheClient } from 'src/infra/cache/cache-client.interface';
import { DrizzleService } from 'src/infra/database/drizzle.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DrizzleService,
    private readonly cache: ICacheClient,
  ) {}
}
