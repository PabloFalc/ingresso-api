import { timestampsSchemas } from 'src/core/shared/schemas/timestamps.schema';
import { z } from 'zod';

export const userBaseSchema = z.object({
  id: z.uuidv7(),
  userName: z.string().min(3).max(50).nonempty(),
  name: z.string().max(255).min(3).nonempty(),
  email: z.email(),
  emailVerified: z.boolean(),
  ...timestampsSchemas.shape,
});

export const userUpdateSchema = userBaseSchema.omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type UserDto = z.infer<typeof userBaseSchema>;
