import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';

export const betterAuthModule = AuthModule.forRoot({
  auth,
  bodyParser: {
    json: { limit: '2mb' },
    urlencoded: { limit: '2mb', extended: true },
    rawBody: true,
  },
  disableGlobalAuthGuard: true,
});
