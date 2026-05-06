import { eventosStatus } from 'src/infra/database/schemas';
import z from 'zod';

export const eventQuerySchema = z
  .object({
    titulo: z.string().max(150).optional(),
    status: z.enum(eventosStatus.enumValues).optional(),

    limit: z.coerce.number().int().min(10).max(100),
    offset: z.coerce.number().int().default(0),
    orderBy: z.enum(['criadoEm', 'status', 'titulo']),
    order: z.enum(['desc', 'asc']).default('desc'),
  })
  .optional();

export type eventQuery = z.infer<typeof eventQuerySchema>;
