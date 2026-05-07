import type { DocumentedParams } from 'src/core/decorators/documented/route-doc.decorator';
import {
  createEventSchema,
  eventsBaseSchema,
  updateEventSchema,
} from '../dtos/events.dto';
import { httpReplySchema } from 'src/core/filters/http/http-reply.schema';
import z from 'zod';
import { ticketTypeBaseSchema } from 'src/modules/ticket/dtos/ticket-type.schema';

export const createEvent: DocumentedParams = {
  statusCode: 201,
  summary: 'Create Event',
  description: 'cria um evento novo',
  body: createEventSchema,
  security: {
    cookie: true,
  },
  response: {
    201: eventsBaseSchema
      .omit({ organizador: true })
      .extend({ organizadorId: z.uuidv7() }),
    400: httpReplySchema,
  },
};

export const updateEventDoc: DocumentedParams = {
  statusCode: 200,
  body: updateEventSchema,
  summary: 'Update Event',
  description: 'Atualiza um evento pelo seu id',
  security: { cookie: true },
  response: {
    200: eventsBaseSchema,
    400: httpReplySchema,
  },
};

export const deleteEvent: DocumentedParams = {
  statusCode: 204,
  summary: 'Delete Event',
  description: 'Deleta um evento pelo seu id',
  security: { cookie: true },
  response: {
    204: z.null(),
    400: httpReplySchema,
    404: httpReplySchema,
  },
};
export const findEventById: DocumentedParams = {
  statusCode: 200,
  summary: 'Find By Id',
  description: 'Encontra um evento pelo seu id',
  security: { cookie: true },
  response: {
    200: eventsBaseSchema,
    400: httpReplySchema,
    404: httpReplySchema,
  },
};

export const findAllEvents: DocumentedParams = {
  statusCode: 200,
  summary: 'Find All Events',
  description: 'Entraga uma paginação de todos os eventos',
  security: { cookie: true },
  response: {
    200: z.array(eventsBaseSchema),
    400: httpReplySchema,
  },
};

export const findIngressosByEventId: DocumentedParams = {
  statusCode: 200,
  summary: 'Find Ingressos By Event id',
  description: 'Encontra todos os ingressos de um determinado evento',
  security: { cookie: true },
  response: {
    200: z.array(ticketTypeBaseSchema),
    400: httpReplySchema,
  },
};
