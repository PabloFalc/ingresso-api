import z from 'zod';
import { userBaseSchema } from 'src/modules/users/dto/uses.dto';

export const sessionShchema = z.object({
  expiredAt: z.iso.datetime(),
  token: z.hash('sha256'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  ipAdress: z.ipv4(),
  userAgent: z.string(),
  userId: z.uuidv7(),
  id: z.uuidv7(),
});

export const authSchema = z
  .object({
    user: userBaseSchema,
    session: sessionShchema,
  })
  .nullable();

export type AuthType = z.infer<typeof authSchema>;

export type SessionType = z.infer<typeof sessionShchema>;
