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

export const createOdersSchema = ordersBaseSchema.omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const updateOrdersSchema = ordersBaseSchema.pick({
  status: true,
  quantidadeTotal: true,
});

export type Orders = z.infer<typeof ordersBaseSchema>;

export type CreateOrders = z.infer<typeof createOdersSchema>;

export type UpdateOrders = z.infer<typeof updateOrdersSchema>;
