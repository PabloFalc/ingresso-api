import { APP_PIPE } from '@nestjs/core';

import { ZodValidationPipe } from 'nestjs-zod';

export const zodValidationPipe = {
  provide: APP_PIPE,
  useClass: ZodValidationPipe,
};
