import type { DocumentedParams } from 'src/core/decorators/documented/route-doc.decorator';
import { userBaseSchema, userUpdateSchema } from '../dto/uses.dto';
import { httpReplySchema } from 'src/core/filters/http/http-reply.schema';
import z from 'zod';
import { usersQuerySchema } from './users-queryschema';

export const findUserById: DocumentedParams = {
  summary: 'FindByid',
  statusCode: 200,
  description: 'Encontra um usuário pelo id',
  response: {
    200: userBaseSchema,
    404: httpReplySchema,
  },
};

export const updateUserById: DocumentedParams = {
  summary: 'UpdateById',
  statusCode: 200,
  description: 'Atualiza os dados de um usuário pelo id',
  body: userUpdateSchema,
  response: {
    200: userBaseSchema,
    404: httpReplySchema,
    500: httpReplySchema,
  },
};

export const findAllUsers: DocumentedParams = {
  summary: 'FindAll',
  query: usersQuerySchema,
  statusCode: 200,
  description: 'Retorna todos os usuário com paginação',
  response: {
    200: z.array(userBaseSchema),
    500: httpReplySchema,
  },
};
