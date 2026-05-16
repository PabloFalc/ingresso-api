import type { DocumentedParams } from 'src/core/decorators/documented/route-doc.decorator';
import { userBaseSchema, userUpdateSchema } from '../dto/uses.dto';
import { httpReplySchema } from 'src/core/filters/http/http-reply.schema';
import z from 'zod';
import { usersQuerySchema } from './users-queryschema';
import { ticketBaseSchema } from 'src/modules/ticket/dtos/ticket.schema';

export const findUserById: DocumentedParams = {
  summary: 'FindByid',
  statusCode: 200,
  description: 'Encontra um usuário pelo id',
  security: {
    cookie: true,
  },
  response: {
    200: userBaseSchema,
    404: httpReplySchema,
  },
};

export const findUsersTickets: DocumentedParams = {
  summary: 'Find Users Tickets',
  statusCode: 200,
  description: 'Encontra os tickets de um usuário',
  security: {
    cookie: true,
  },
  response: {
    200: z.array(ticketBaseSchema),
    500: httpReplySchema,
  },
};

export const updateUserById: DocumentedParams = {
  summary: 'UpdateById',
  statusCode: 200,
  description: 'Atualiza os dados de um usuário pelo id',
  security: {
    cookie: true,
  },
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
  security: {
    cookie: true,
  },
  description: 'Retorna todos os usuário com paginação',
  response: {
    200: z.array(userBaseSchema),
    500: httpReplySchema,
  },
};
