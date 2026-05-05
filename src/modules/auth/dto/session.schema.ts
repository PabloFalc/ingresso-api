import z from 'zod';
import { zDatetime } from 'src/core/shared/schemas/datetime.schema';
import { userBaseSchema } from 'src/modules/users/dto/uses.dto';

export const sessionShchema = z.object({
  expiredAt: zDatetime,
  token: z.hash('sha256'),
  createdAt: zDatetime,
  updatedAt: zDatetime,
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
