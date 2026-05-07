import { z } from 'zod';

export const usersQuerySchema = z
  .object({
    name: z.string().min(3).max(150).optional(),

    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.coerce.number().min(0).default(0),

    orderBy: z.enum(['name', 'createdAt', 'email']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc').default('desc'),
  })
  .optional();

export type UsersQuery = z.infer<typeof usersQuerySchema>;
