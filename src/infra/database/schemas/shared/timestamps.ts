import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  criadoEm: timestamp('created_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow(),
  atualizadoEm: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdate(() => new Date()),
};

import { customType } from 'drizzle-orm/pg-core';

export const timestampIso = customType<{ data: string }>({
  dataType() {
    return 'timestamp with time zone';
  },
  toDriver(value: string) {
    return new Date(value).toISOString();
  },
  fromDriver(value: unknown) {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return new Date(value).toISOString();
    return value as string;
  },
});
