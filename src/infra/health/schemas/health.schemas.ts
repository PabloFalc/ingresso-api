import { z } from 'zod';

export const healthCheckSchema = z.object({
  status: z.enum(['ok', 'error', 'warning']),
  responseTime: z.number().nonnegative().optional(),
  error: z.string().optional(),
  details: z.record(z.string(), z.any()).optional(),
});

export const healthSchema = z.object({
  status: z.enum(['ok', 'degraded', 'unavailable']),
  timestamp: z.iso.datetime(),
  uptime: z.number().nonnegative(),
  checks: z.record(z.string(), healthCheckSchema),
});

export const healthLiveSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.iso.datetime(),
});

export type HealthCheckResult = z.infer<typeof healthCheckSchema>;
export type HealthResult = z.infer<typeof healthSchema>;
