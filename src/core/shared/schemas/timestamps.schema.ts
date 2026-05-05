import z from 'zod';
import { zDatetime } from './datetime.schema';

export const timestampsSchemas = z.object({
  createdAt: zDatetime,
  updatedAt: zDatetime.nullable(),
  deletedAt: zDatetime.nullable(),
});

export type Timestamps = z.infer<typeof timestampsSchemas>;
