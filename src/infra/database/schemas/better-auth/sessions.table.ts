import { pgTable, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.table';
import { uuidv7 } from 'uuidv7';

// ! BETTER-AUTH
export const sessions = pgTable(
  'sessions',
  (t) => ({
    id: t
      .text('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    expiresAt: t.timestamp('expires_at').notNull(),
    token: t.text('token').notNull().unique(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
    updatedAt: t
      .timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: t.text('ip_address'),
    userAgent: t.text('user_agent'),
    userId: t
      .text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    activeOrganizationId: t.text('active_organization_id'),
  }),

  (table) => [index('sessions_userId_idx').on(table.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
