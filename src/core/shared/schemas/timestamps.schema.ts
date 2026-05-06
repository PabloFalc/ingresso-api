import z from 'zod';
import { zDatetime } from './datetime.schema';

export const timestampsSchemas = z.object({
  criadoEm: zDatetime,
  atualizadoEm: zDatetime.nullable(),
});

export type Timestamps = z.infer<typeof timestampsSchemas>;
