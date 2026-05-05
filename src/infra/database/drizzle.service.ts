import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseClient } from './database-client.interface';
import * as schema from './schemas/index';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from './drizzle-client';

@Injectable()
export class DrizzleService implements IDatabaseClient {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  getInstance(): NodePgDatabase<typeof schema> {
    return this.db;
  }
}
