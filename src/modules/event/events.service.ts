import { Injectable } from '@nestjs/common';
import type { RedisService } from 'src/infra/cache/redis.service';
import type { DrizzleService } from 'src/infra/database/drizzle.service';
import { CreateEvent, Event } from './dtos/events.dto';

import { eventos } from 'src/infra/database/schemas';
import { DrizzleError } from 'drizzle-orm';
import { InternalServerError } from 'src/core/erros/http.errors';
import { eventQuery } from './schemas/events-query.schema';

@Injectable()
export class EventsService {
  private readonly cacheKey: string = 'eventos';
  constructor(
    private readonly db: DrizzleService,
    private readonly cache: RedisService,
  ) {}

  async create(data: CreateEvent) {
    const db = this.db.getInstance();

    try {
      const [result] = await db.insert(eventos).values(data).returning();

      return result;
    } catch (error: unknown) {
      if (error instanceof DrizzleError) {
        throw new InternalServerError({
          message: error.message,
          details: error.cause,
        });
      }
      return error;
    }
  }

  async getAllEvents(query: eventQuery) {}
}
