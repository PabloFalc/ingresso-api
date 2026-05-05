import { APP_INTERCEPTOR } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';

export const zodSerializerInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: ZodSerializerInterceptor,
};
