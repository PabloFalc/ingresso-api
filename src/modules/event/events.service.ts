import { Injectable } from '@nestjs/common';

import { ICacheClient } from 'src/infra/cache/cache-client.interface';
import { DrizzleService } from 'src/infra/database/drizzle.service';
import { CreateEvent, Event, UpdateEvent } from './dtos/events.dto';

import { eventos, tipoIngresso } from 'src/infra/database/schemas';
import { DrizzleError, ilike, eq, and, SQL } from 'drizzle-orm';
import { InternalServerError } from 'src/core/erros/http.errors';
import { EventQuery } from './schemas/events-query.schema';
import { DrizzleQueryError } from 'drizzle-orm';

@Injectable()
export class EventsService {
  private readonly cacheKey: string = 'eventos';
  constructor(
    private readonly db: DrizzleService,
    private readonly cache: ICacheClient,
  ) {}

  async create(data: CreateEvent) {
    const db = this.db.getInstance();

    try {
      const [result] = await db.insert(eventos).values(data).returning();
      return result;
    } catch (error: unknown) {
      if (error instanceof DrizzleError || error instanceof DrizzleQueryError) {
        throw new InternalServerError({
          message: error.message,
          details: error.cause,
        });
      }

      return error;
    }
  }

  async findById(id: string) {
    const cached = await this.cache.get<Event>({
      key: this.cacheKey,
      prefix: { id },
    });

    if (cached) return cached;

    try {
      const event = await this.db.getInstance().query.eventos.findFirst({
        where: (eventos) => eq(eventos.id, id),
        with: {
          organizador: true,
        },
      });

      if (!event) {
        throw new InternalServerError({
          message: 'Evento não encontrado',
        });
      }

      await this.cache.set({
        key: this.cacheKey,
        prefix: { id },
        value: event,
        ttl: 100,
      });

      return event;
    } catch (error: unknown) {
      if (error instanceof DrizzleError) {
        throw new InternalServerError({
          message: error.message,
          details: error.cause,
        });
      }
      throw error;
    }
  }

  async getAllEvents(query: EventQuery) {
    const {
      titulo,
      status,
      limit = 10,
      offset = 0,
      order = 'desc',
      orderBy = 'criadoEm',
    } = query ?? {};

    const cached = await this.cache.get<Event[]>({
      key: this.cacheKey,
      prefix: query,
    });

    if (cached) return cached;

    const column = eventos[orderBy] ?? eventos.criadoEm;

    const filters: SQL[] = [];

    if (titulo) {
      filters.push(ilike(eventos.titulo, `%${titulo}%`));
    }

    if (status) {
      filters.push(eq(eventos.status, status));
    }

    try {
      const result = await this.db.getInstance().query.eventos.findMany({
        where: (eventos, { and }) =>
          filters.length ? and(...filters) : undefined,

        orderBy: (eventos, { asc, desc }) => [
          order === 'asc' ? asc(column) : desc(column),
        ],

        limit: limit,
        offset: offset,

        with: {
          organizador: true,
        },
      });

      await this.cache.set({
        key: this.cacheKey,
        prefix: query,
        value: result,
        ttl: 100,
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof DrizzleError) {
        throw new InternalServerError({
          message: error.message,
          details: error.cause,
        });
      }
      throw error;
    }
  }

  async updateEventById(id: string, data: UpdateEvent) {
    const db = this.db.getInstance();

    if (!data) throw new InternalServerError();

    try {
      const [updated] = await db
        .update(eventos)
        .set(data)
        .where(eq(eventos.id, id))
        .returning();

      if (!updated) {
        throw new InternalServerError({
          message: 'Evento não encontrado',
        });
      }

      const event = await this.db.getInstance().query.eventos.findFirst({
        where: (eventos) => eq(eventos.id, id),
        with: {
          organizador: true,
        },
      });

      await this.cache.set({
        key: this.cacheKey,
        prefix: 'invalidate',
        value: null,
        ttl: 1,
      });

      return event;
    } catch (error: unknown) {
      if (error instanceof DrizzleError) {
        throw new InternalServerError({
          message: error.message,
          details: error.cause,
        });
      }
      throw error;
    }
  }

  async deleteEventById(id: string) {
    const db = this.db.getInstance();

    try {
      const [deleted] = await db
        .delete(eventos)
        .where(eq(eventos.id, id))
        .returning();

      if (!deleted) {
        throw new InternalServerError({
          message: 'Evento não encontrado',
        });
      }

      await this.cache.clear(this.cacheKey);

      return null;
    } catch (error: unknown) {
      if (error instanceof DrizzleError) {
        throw new InternalServerError({
          message: error.message,
          details: error.cause,
        });
      }
      throw error;
    }
  }

  async findIngressosByEventId(eventId: string) {
    const cacheKey = `${this.cacheKey}:tipos-ingresso`;

    const cached = await this.cache.get({
      key: cacheKey,
      prefix: { eventId },
    });

    if (cached) return cached;

    try {
      const result = await this.db
        .getInstance()
        .select()
        .from(tipoIngresso)
        .where(and(eq(tipoIngresso.eventoId, eventId)));

      await this.cache.set({
        key: cacheKey,
        prefix: { eventId },
        value: result,
        ttl: 100,
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof DrizzleError) {
        throw new InternalServerError({
          message: error.message,
          details: error.cause,
        });
      }
      throw error;
    }
  }
}
