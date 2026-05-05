import fastifyCookie from '@fastify/cookie';
import type { AppSetup } from '../setup';
import { env } from '../env';

export const cookies: AppSetup = async (app) => {
  await app.register(fastifyCookie, {
    secret: env.COOKIE_SECRET,
  });
};
