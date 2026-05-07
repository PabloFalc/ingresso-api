import type { DocumentedParams } from 'src/core/decorators/documented/route-doc.decorator';
import { httpReplySchema } from 'src/core/filters/http/http-reply.schema';
import {
  ticketTypeBaseSchema,
  createTicketTypeSchema,
  updateTicketTypeSchema,
} from '../dtos/ticket-type.schema';
import z from 'zod';

export const createTicketTypeDoc: DocumentedParams = {
  statusCode: 201,
  summary: 'Create Ticket Type',
  description:
    'Cria um tipo de ingresso para um evento. Somente o organizador do evento pode criar.',
  body: createTicketTypeSchema,
  security: { cookie: true },
  response: {
    201: ticketTypeBaseSchema,
    400: httpReplySchema,
    403: httpReplySchema,
    404: httpReplySchema,
  },
};

export const findAllTicketTypesByEventDoc: DocumentedParams = {
  statusCode: 200,
  summary: 'Find All Ticket Types by Event',
  description: 'Retorna todos os tipos de ingresso de um evento',
  security: { cookie: true },
  response: {
    200: z.array(ticketTypeBaseSchema),
    404: httpReplySchema,
  },
};

export const findTicketTypeByIdDoc: DocumentedParams = {
  statusCode: 200,
  summary: 'Find Ticket Type By Id',
  description: 'Encontra um tipo de ingresso pelo seu id',
  security: { cookie: true },
  response: {
    200: ticketTypeBaseSchema,
    404: httpReplySchema,
  },
};

export const updateTicketTypeDoc: DocumentedParams = {
  statusCode: 200,
  summary: 'Update Ticket Type',
  description:
    'Atualiza um tipo de ingresso. Somente o organizador do evento pode editar.',
  body: updateTicketTypeSchema,
  security: { cookie: true },
  response: {
    200: ticketTypeBaseSchema,
    400: httpReplySchema,
    403: httpReplySchema,
    404: httpReplySchema,
  },
};

export const deleteTicketTypeDoc: DocumentedParams = {
  statusCode: 204,
  summary: 'Delete Ticket Type',
  description:
    'Deleta um tipo de ingresso. Somente o organizador pode deletar e apenas se nenhum ingresso foi vendido.',
  security: { cookie: true },
  response: {
    204: z.null(),
    400: httpReplySchema,
    403: httpReplySchema,
    404: httpReplySchema,
  },
};
