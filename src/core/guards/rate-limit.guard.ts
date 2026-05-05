import { ExecutionContext, Injectable } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerLimitDetail,
  ThrottlerModule,
} from '@nestjs/throttler';
import { ThrottlerError } from '../erros/throttler.error';
@Injectable()
class RateLimitGuard extends ThrottlerGuard {
  protected throwThrottlingException(
    _context: ExecutionContext,
    details: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new ThrottlerError(details.timeToBlockExpire);
  }
}

const rateLimit = {
  provide: APP_GUARD,
  useClass: RateLimitGuard,
};

const throttler = ThrottlerModule.forRoot({
  throttlers: [
    {
      ttl: 60000,
      limit: 50,
      blockDuration: 60000,
    },
  ],
});

export { throttler, rateLimit, RateLimitGuard };
