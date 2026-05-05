import Redis from 'ioredis';
import { env } from '../../config/env';
import { Logger } from '@nestjs/common';

// Token
export const REDIS = 'REDIS_CLIENT';

// ! conexão com o redis
export const redis: () => Redis = () => {
  const logger = new Logger('Redis');

  const client = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);

      logger.warn(`Redis retry attempt #${times} - reconnecting in ${delay}ms`);

      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  // logging dos eventos
  client.on('connect', () => {
    logger.log({ component: 'redis' }, 'Redis connected');
  });

  client.on('error', (error) => {
    logger.error({ component: 'redis', error }, 'Redis error');
  });

  client.on('close', () => {
    logger.warn({ component: 'redis' }, 'Redis connection closed');
  });

  client.on('reconnecting', () => {
    logger.warn({ component: 'redis' }, 'Redis reconnecting');
  });

  return client;
};

// ? DI do Nest para utilizar como provider
export const redisClient = {
  provide: REDIS,
  useFactory: () => redis(),
};
