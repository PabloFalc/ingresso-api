import { createZodDto, type ZodDto } from 'nestjs-zod';
import { createHash } from 'crypto';
import type { ZodType } from 'zod';

const dtoCache = new Map<string, ZodDto<ZodType<unknown, any, any>, false>>();

export function getOrCreateDto<T extends ZodType<unknown, any, any>>(
  schema: T,
): ZodDto<T, false> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const json = JSON.stringify(schema._zod.def);
  const hash = createHash('sha256').update(json).digest('hex').slice(0, 8);

  const cached = dtoCache.get(hash);
  if (cached) {
    return cached as ZodDto<T, false>;
  }

  const dto = createZodDto(schema);

  Object.defineProperty(dto, 'name', {
    value: `ZodDto_${hash}`,
  });

  dtoCache.set(hash, dto);

  return dto;
}
