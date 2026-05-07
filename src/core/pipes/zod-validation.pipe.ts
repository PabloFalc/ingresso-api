import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

// import { ZodValidationPipe } from 'nestjs-zod';
import { type ZodType } from 'zod';
import { BadRequestError } from '../erros/http.errors';
import { ZodValidationPipe } from 'nestjs-zod';

export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodType<any, any, any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (!this.schema) {
      return value;
    }

    if (metadata.type === 'custom' || metadata.type === 'param') return value;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, success, data } = this.schema.safeParse(value);

    console.log(`error: ${error}, data: ${data}, metadado:${metadata.type}`);

    if (!success)
      throw new BadRequestError({
        message: 'Validation Error',
        details: error.issues,
      });
    return data as unknown;
  }
}

export const zodValidationPipe = {
  provide: APP_PIPE,
  useClass: ZodValidationPipe,
};
