import fastifyHelmet from '@fastify/helmet';
import type { AppSetup } from '../setup';
import { env } from '../env';

export const hemelt: AppSetup = async (app) => {
  const isDev = env.NODE_ENV === 'development';
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", ...(isDev ? ["'unsafe-inline'"] : [])],
        scriptSrc: [
          "'self'",
          ...(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
        ],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:', 'https:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: isDev ? ["'self'"] : ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
};
