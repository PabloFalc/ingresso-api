import { Logger, LoggerModule } from 'nestjs-pino';
import { env } from 'src/config/env';
import { type AppSetup } from '../setup';

const isDev = env.NODE_ENV === 'development';
const isTest = env.NODE_ENV === 'test';

export const pino: AppSetup = (app) => {
  app.useLogger(app.get(Logger));
};

export const configPino = LoggerModule.forRoot({
  pinoHttp: isTest
    ? {
        level: 'silent',
      }
    : {
        level: isDev ? 'debug' : 'info',
        base: isDev
          ? undefined
          : {
              service: 'boilerplate-fastify',
              env: env.NODE_ENV,
            },
        ...(isDev && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }),
      },
});
