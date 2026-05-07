import { z } from 'zod';

export const userBaseSchema = z.object({
  id: z.uuidv7(),
  cpf: z.string().min(11).max(14).nonempty(),
  name: z.string().max(255).min(3).nonempty(),
  email: z.email(),
  emailVerified: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
});

export const userUpdateSchema = userBaseSchema.omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
});

export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type UserDto = z.infer<typeof userBaseSchema>;
