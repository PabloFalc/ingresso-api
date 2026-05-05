import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../../config/env';
import * as schema from './schemas/index';

// Token
export const DRIZZLE = 'DRIZZLE_CLIENT';

// ! Client do drizzle
export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: 'snake_case',
});

// ? DI do Nest para utilizar como provider
export const drizzleClient = {
  provide: DRIZZLE,
  useValue: db,
};
