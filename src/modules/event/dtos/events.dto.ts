import { zDatetime } from 'src/core/shared/schemas/datetime.schema';
import { eventosStatus } from 'src/infra/database/schemas';
import { userBaseSchema } from 'src/modules/users/dto/uses.dto';
import z from 'zod';

export const eventsBaseSchema = z.object({
  id: z.uuidv7(),
  titulo: z.string().max(150).min(30),
  descricao: z.string(),
  dataInicio: zDatetime,
  dataFim: zDatetime,
  status: z.enum(eventosStatus.enumValues),
  local: z.string(),
  organizador: userBaseSchema.omit({ emailVerified: true }),
});

export const createEventSchema = eventsBaseSchema
  .extend({
    organizadorId: z.uuidv7(),
    dataInicio: z.date(),
    dataFim: z.date(),
  })
  .omit({ organizador: true, id: true });

export const updateEventSchema = createEventSchema.partial();

export type Event = z.infer<typeof eventsBaseSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;

export type updateEvent = z.infer<typeof updateEventSchema>;
