import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
  CacheGetParams,
  CacheSetParams,
  ICacheClient,
} from './cache-client.interface';
import { REDIS } from './redis.client';

@Injectable()
export class RedisService implements ICacheClient {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async get<T>(params: CacheGetParams): Promise<T | null> {
    const { key, prefix } = params;
    try {
      const result = await this.redis.get(this._makePrefix(key, prefix));
      if (!result) return null;
      return JSON.parse(result) as T;
    } catch (error: unknown) {
      this.logger.error(
        { component: 'cache', err: error, key },
        'Cache get error',
      );
      return null;
    }
  }

  async set(params: CacheSetParams): Promise<void> {
    const { key, value, ttl, prefix } = params;
    try {
      const serialized = JSON.stringify(value);
      const keyWithPrefix = this._makePrefix(key, prefix);
      if (ttl) {
        await this.redis.setex(keyWithPrefix, ttl, serialized);
      } else {
        await this.redis.set(keyWithPrefix, serialized);
      }
    } catch (error: unknown) {
      this.logger.error(
        { component: 'cache', err: error, key },
        'Cache set error',
      );
    }
  }

  async exists(params: CacheGetParams): Promise<boolean> {
    const { key, prefix } = params;
    try {
      return (await this.redis.exists(this._makePrefix(key, prefix))) === 1;
    } catch (error: unknown) {
      this.logger.error(
        { component: 'cache', err: error, key },
        'Cache exists error',
      );
      return false;
    }
  }

  async clear(prefix: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const [next, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          `${prefix}:*`,
          'COUNT',
          100,
        );

        if (keys.length > 0) {
          await this.redis.unlink(...keys);
        }

        cursor = next;
      } while (cursor !== '0');
    } catch (error: unknown) {
      this.logger.error(
        { component: 'cache', err: error },
        'Cache clear error',
      );
    }
  }

  withPrefix(prefix: string): ICacheClient {
    return {
      get: (params) => this.get({ ...params, prefix }),
      set: (params) => this.set({ ...params, prefix }),
      exists: (params) => this.exists({ ...params, prefix }),
      clear: () => this.clear(prefix),
    };
  }

  private stableStringify(obj?: Record<string, unknown>): string {
    if (!obj) return '';

    return JSON.stringify(
      Object.keys(obj)
        .filter((key) => obj[key] !== undefined)
        .sort()
        .reduce(
          (acc, key) => {
            acc[key] = obj[key];
            return acc;
          },
          {} as Record<string, any>,
        ),
    );
  }

  private _makePrefix(key: string, prefix?: unknown): string {
    if (!prefix) return key;

    const normalized =
      typeof prefix === 'string'
        ? prefix
        : this.stableStringify(prefix as Record<string, any>);

    return `${key}:${normalized}`;
  }
}
