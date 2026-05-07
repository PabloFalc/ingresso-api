import { Module } from '@nestjs/common';
// import { zodValidationPipe } from './pipes/zod-validation.pipe';
import { zodSerializerInterceptor } from './interceptors/zod-serializer.interceptor';
import { rateLimit, throttler } from './guards/rate-limit.guard';
import { httpExceptionFilter } from './filters/http/http-exception.filter';
import { configPino } from 'src/config/plugins/pino.config';
import { betterAuthModule } from './shared/better-auth.module';

@Module({
  imports: [throttler, configPino, betterAuthModule],
  providers: [
    // zodValidationPipe,
    zodSerializerInterceptor,
    httpExceptionFilter,
    rateLimit,
  ],
})
class CoreModule {}

export { CoreModule };
