import type { DocumentedParams } from 'src/core/decorators/documented/route-doc.decorator';
import { authSchema } from '../dto/session.schema';
import { signInSchema, signUpSchema, authOutSchema } from '../dto/auth.schema';
import { httpReplySchema } from 'src/core/filters/http/http-reply.schema';
import z from 'zod';

export const authGetSession: DocumentedParams = {
  statusCode: 200,
  summary: 'Get Session',
  description: 'Recupera as credencias da sessão atual',
  response: {
    200: authSchema,
  },
};

export const authSignIn: DocumentedParams = {
  statusCode: 200,
  summary: 'Sign In',
  body: signInSchema,
  description: 'Faz login utilizando as credenciais do usuário',
  response: {
    200: authOutSchema,
  },
};

export const authSignUp: DocumentedParams = {
  statusCode: 200,
  summary: 'Sing Up',
  body: signUpSchema,
  description: 'Registra o usário utilizando email e senha',
  response: {
    200: authOutSchema.omit({ redirect: true }),
    404: httpReplySchema,
  },
};

export const authSignOut: DocumentedParams = {
  statusCode: 200,
  summary: 'Sign Out',
  description: 'Desconecta o usuário',
  response: {
    200: z.object({ success: z.boolean() }),
  },
};

export const authRefresh: DocumentedParams = {
  statusCode: 200,
  summary: 'Refresh Token',
  description: 'Renova o token da sessão',
};
