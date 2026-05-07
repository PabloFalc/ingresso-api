import { ingressoStatus } from 'src/infra/database/schemas';
import z from 'zod';

export const ticketBaseSchema = z.object({
  id: z.uuidv7(),
  pedidoId: z.uuidv7(),
  eventoId: z.uuidv7(),
  userId: z.uuidv7(),
  status: z.enum(ingressoStatus.enumValues).default('VALIDO'),
  criadoEm: z.iso.datetime(),
});

export const createTicketSchema = ticketBaseSchema.omit({
  id: true,
  criadoEm: true,
});

export const updateTicketSchema = ticketBaseSchema.pick({ status: true });

export type Ticket = z.infer<typeof ticketBaseSchema>;

export type CreateTicket = z.infer<typeof createTicketSchema>;

export type UpdateTicket = z.infer<typeof updateTicketSchema>;
