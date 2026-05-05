import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from '../../config/env';
import { db } from '../../infra/database/drizzle-client';

export const auth = betterAuth({
  emailAndPassword: { enabled: true },

  secret: env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    camelCase: false,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7,
  },
  user: {
    additionalFields: {
      userName: {
        required: true,
        unique: true,
        type: 'string',
      },
    },
  },
  trustedOrigins: [env.CORS_ORIGIN],
  advanced: {
    database: {
      generateId: false,
    },
  },
});
