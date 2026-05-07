import { zDatetime } from 'src/core/shared/schemas/datetime.schema';
import z from 'zod';

export const ticketTypeBaseSchema = z.object({
  id: z.uuidv7(),
  eventoId: z.uuidv7(),
  nome: z.string().max(150),
  preco: z.int(),
  quantidadeTotal: z.int(),
  quantidadeVendida: z.int(),
  inicioVenda: zDatetime,
  fimVenda: zDatetime,
  ativo: z.boolean(),
});

export const createTicketTypeSchema = ticketTypeBaseSchema.omit({
  id: true,
  quantidadeVendida: true,
});

export const updateTicketTypeSchema = ticketTypeBaseSchema
  .omit({
    id: true,
    eventoId: true,
  })
  .partial();

export type TicketType = z.infer<typeof ticketTypeBaseSchema>;

export type CreateTicketType = z.infer<typeof createTicketTypeSchema>;

export type UpdateTicketType = z.infer<typeof updateTicketTypeSchema>;
