import 'dotenv/config';
import { z } from 'zod';

export const envConfigSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3100),
  HOST: z.string().default('0.0.0.0'),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // BETTER AUTH
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_PORT: z.coerce.number().default(3100),

  // COOKIES
  COOKIE_SECRET: z.string().min(32),
  COOKIE_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CORS_ORIGIN: z.string().default('*'),

  // DATABASE
  DATABASE_URL: z.url(),

  // REDIS
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
});

export const env = envConfigSchema.parse(process.env);

export type Env = z.infer<typeof envConfigSchema>;
