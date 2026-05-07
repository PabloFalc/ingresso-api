import { pedidoStatus } from 'src/infra/database/schemas';
import z from 'zod';

export const ordersBaseSchema = z.object({
  id: z.uuidv7(),
  userId: z.uuidv7(),
  quantidadeTotal: z.int(),
  status: z.enum(pedidoStatus.enumValues).default('PENDENTE'),
  criadoEm: z.iso.datetime(),
  atualizadoEm: z.iso.datetime(),
});

export const createOrdersSchema = ordersBaseSchema.omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const orderItemBodySchema = z.object({
  tipoIngressoId: z.uuidv7(),
  quantidade: z.int().min(1),
});

export const createOrdersBodySchema = z.object({
  itens: z.array(orderItemBodySchema).min(1),
});
export const updateOrdersSchema = ordersBaseSchema.pick({
  status: true,
  quantidadeTotal: true,
});

export type Orders = z.infer<typeof ordersBaseSchema>;
export type OrderItemBody = z.infer<typeof orderItemBodySchema>;
export type CreateOrdersBody = z.infer<typeof createOrdersBodySchema>;
export type CreateOrders = z.infer<typeof createOrdersSchema>;
export type UpdateOrders = z.infer<typeof updateOrdersSchema>;
