import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  criadoEm: timestamp('created_at').notNull().defaultNow(),
  atualizadoEm: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdate(() => new Date()),
};
