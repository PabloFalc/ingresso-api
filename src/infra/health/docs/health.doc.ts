import { type DocumentedParams } from 'src/core/decorators/documented/route-doc.decorator';
import { healthSchema } from '../schemas/health.schemas';
import { httpReplySchema } from 'src/core/filters/http/http-reply.schema';

export const checkDocument: DocumentedParams = {
  statusCode: 200,
  description:
    'Rota de checagem da saúde da api; 200 OK = tudo ok;  200 DEGRADED = Redis ou memória falhou; 503 UNAVALIBLE = Banco de dados falou ou está indisponível',
  response: {
    200: healthSchema,
    503: httpReplySchema.extend({
      details: healthSchema,
    }),
  },
};
