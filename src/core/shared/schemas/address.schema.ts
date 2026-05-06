import z from 'zod';

export const addressSchema = z.object({
  id: z.uuidv7(),
  streetAdress: z.string().max(100),
  zipCode: z.string().max(9).min(8),
  number: z.int(),
  addition: z.string().nullish(),
  city: z.string().max(100),
  state: z.string().max(100),
  country: z.string().max(100),
});
