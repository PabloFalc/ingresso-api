import { userBaseSchema } from 'src/modules/users/dto/uses.dto';
import z from 'zod';

export const authOutSchema = z.object({
  redirect: z.boolean(),
  token: z.hash('sha256'),
  user: userBaseSchema,
});

export const signUpSchema = userBaseSchema
  .omit({
    id: true,
    emailVerified: true,
    updatedAt: true,
    createdAt: true,
  })
  .extend({
    password: z.string().min(8),
  });

export const signInSchema = signUpSchema.pick({ email: true, password: true });
