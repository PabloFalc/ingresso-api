import { z } from 'zod';

export const httpReplySchema = z.object({
  name: z.string(),
  statusCode: z.number(),
  code: z.string(),
  message: z.string(),
  timestamp: z.string(),
  details: z.any(),
  path: z.string(),
});
