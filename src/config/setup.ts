import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { swagger } from './plugins/swagger.config';
import { cors } from './plugins/cors.config';
import { hemelt } from './plugins/hemelt.config';
import { cookies } from './plugins/cookies.config';
import { pino } from './plugins/pino.config';

export type AppSetup = (app: NestFastifyApplication) => void | Promise<void>;

const configs: AppSetup[] = [pino, swagger, cors, hemelt, cookies];

export async function setupPlugins(app: NestFastifyApplication) {
  for (const config of configs) {
    await config(app);
  }
}
