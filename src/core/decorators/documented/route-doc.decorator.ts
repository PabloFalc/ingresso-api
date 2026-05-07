import {
  applyDecorators,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { type ZodType } from 'zod';
import { type ZodDto } from 'nestjs-zod';
import {
  ApiOperation,
  ApiCookieAuth,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { getOrCreateDto } from './helpers/get-create-dto-cache';
import { ZodResponseInterceptor } from 'src/core/interceptors/zod-response.interceptor';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { ZodPipe } from 'src/core/pipes/zod-validation.pipe';

export type DocumentedParams = {
  summary?: string;
  description?: string;
  tags?: string[];
  body?: ZodType;
  query?: ZodType;

  security?: {
    bearer?: boolean;
    cookie?: boolean;
  };

  response?: Record<number, ZodType>;
  statusCode: number;
};

function getOpenApiType(dto: ZodDto) {
  return !dto.codec && '_zod' in dto.schema ? dto.Output : dto;
}

export function Documented(props: DocumentedParams) {
  const decorators: MethodDecorator[] = [];

  const {
    summary,
    body,
    description,
    statusCode,
    query,
    tags,
    response,
    security,
  } = props;

  decorators.push(
    ApiOperation({
      summary: summary,
      description: description,
      tags: tags,
    }),
  );

  if (body) {
    const dto = getOrCreateDto(body);
    decorators.push(ApiBody({ type: dto }), UsePipes(new ZodPipe(body)));
  }

  if (query) {
    const dto = getOrCreateDto(query);

    decorators.push(ApiQuery({ type: dto }), UsePipes(new ZodPipe(query)));
  }

  if (security?.cookie) {
    decorators.push(ApiCookieAuth('cookie'));
    decorators.push(UseGuards(AuthGuard));
  }
  if (security?.bearer) {
    decorators.push(ApiBearerAuth('bearer'));
  }

  if (response) {
    decorators.push(UseInterceptors(new ZodResponseInterceptor(response)));
    const entries = Object.entries(response);

    entries.forEach(([status, schema]) => {
      const dto = getOrCreateDto(schema);

      decorators.push(
        ApiResponse({
          status: Number(status),
          type: getOpenApiType(dto),
        }),
      );
    });
  }

  decorators.push(HttpCode(statusCode));

  return applyDecorators(...decorators);
}
