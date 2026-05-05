import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { AppSetup } from '../setup';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import packageJson from '../../../package.json';
import { env } from '../env';
import scalarApiReference from '@scalar/fastify-api-reference';

const { version } = packageJson;

export const swagger: AppSetup = async (app) => {
  if (env.NODE_ENV === 'production') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('API INGRESSE-HERE')
    .setDescription('Documentação da API dos ingressos')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Access token retornado no body de POST /api/login ou POST /api/register. Cole o valor de token aqui.',
    })
    .addCookieAuth(
      'better-auth.session_token',
      {
        type: 'apiKey',
        in: 'cookie',
      },
      'cookie',
    )
    .addServer(`http://localhost:${env.PORT}`, 'Servidor de desenvolvimento')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const cleaned = cleanupOpenApiDoc(document);

  app
    .getHttpAdapter()
    .getInstance()
    .get('/openapi.json', (_, res) => {
      res.send(cleaned);
    });

  await app.register(scalarApiReference, {
    routePrefix: '/docs',
    configuration: {
      url: '/openapi.json',
      theme: 'deepSpace',
      layout: 'modern',
    },
  });
};
