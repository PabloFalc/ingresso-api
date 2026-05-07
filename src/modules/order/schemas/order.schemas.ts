import type { DocumentedParams } from 'src/core/decorators/documented/route-doc.decorator';
import { httpReplySchema } from 'src/core/filters/http/http-reply.schema';
import { ordersBaseSchema, createOrdersBodySchema } from '../dtos/order.dto';
import z from 'zod';

export const createOrderDoc: DocumentedParams = {
  statusCode: 201,
  summary: 'Create Order',
  description: 'Cria um novo pedido com um ou mais tipos de ingresso',
  body: createOrdersBodySchema,
  security: { cookie: true },
  response: {
    201: ordersBaseSchema,
    400: httpReplySchema,
  },
};

export const findAllOrdersDoc: DocumentedParams = {
  statusCode: 200,
  summary: 'Find All Orders',
  description: 'Retorna todos os pedidos do usuário autenticado',
  security: { cookie: true },
  response: {
    200: z.array(ordersBaseSchema),
    400: httpReplySchema,
  },
};

export const findOrderByIdDoc: DocumentedParams = {
  statusCode: 200,
  summary: 'Find Order By Id',
  description:
    'Encontra um pedido pelo seu id (somente do usuário autenticado)',
  security: { cookie: true },
  response: {
    200: ordersBaseSchema,
    404: httpReplySchema,
  },
};

export const payOrderDoc: DocumentedParams = {
  statusCode: 200,
  summary: 'Pay Order',
  description: 'Paga um pedido e gera os ingressos automaticamente',
  security: { cookie: true },
  response: {
    200: ordersBaseSchema,
    400: httpReplySchema,
    404: httpReplySchema,
  },
};

export const cancelOrderDoc: DocumentedParams = {
  statusCode: 200,
  summary: 'Cancel Order',
  description: 'Cancela um pedido com status PENDENTE',
  security: { cookie: true },
  response: {
    200: ordersBaseSchema,
    400: httpReplySchema,
    404: httpReplySchema,
  },
};
