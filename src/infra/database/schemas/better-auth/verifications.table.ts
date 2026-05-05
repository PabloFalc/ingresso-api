import { pgTable, index } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

// ! BETTER-AUTH
export const verifications = pgTable(
  'verifications',
  (t) => ({
    id: t
      .text('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    identifier: t.text('identifier').notNull(),
    value: t.text('value').notNull(),
    expiresAt: t.timestamp('expires_at').notNull(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
    updatedAt: t
      .timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index('verifications_identifier_idx').on(table.identifier)],
);
