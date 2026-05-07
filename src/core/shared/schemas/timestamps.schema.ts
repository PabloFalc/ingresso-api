import z from 'zod';

export const timestampsSchemas = z.object({
  criadoEm: z.iso.datetime(),
  atualizadoEm: z.iso.datetime(),
});

export type Timestamps = z.infer<typeof timestampsSchemas>;
