import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppError } from '../../erros/base-app.error';
import { ExceptionFilter } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Catch(AppError)
class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (exception.statusCode === 500) {
      this.logger.error(exception);
    } else {
      this.logger.warn(exception.message, exception.details);
    }

    return reply.status(exception.statusCode).send({
      name: exception.name,
      statusCode: exception.statusCode,
      code: exception.code,
      message: exception.message,
      timestamp: exception.timestamp,
      details: exception.details,
      path: request.url,
    });
  }
}

export const httpExceptionFilter = {
  provide: APP_FILTER,
  useClass: AppExceptionFilter,
};
