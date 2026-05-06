import { pgTable, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';
import { sessions } from './sessions.table';
import { accounts } from '../better-auth/accounts.table';
import { ingressos } from '../ticket.table';
import { pedidos } from '../order.table';

export const users = pgTable(
  'users',
  (t) => ({
    id: t
      .text('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    cpf: t.varchar('user_name', { length: 14 }).unique().notNull(),
    name: t.varchar('name', { length: 255 }).notNull(),
    email: t.varchar('email', { length: 255 }).unique().notNull(),
    emailVerified: t.boolean('email_verified').default(false).notNull(),
    createdAt: t.timestamp('criado_em').notNull().defaultNow(),
    updatedAt: t
      .timestamp('atualizado_em', {
        mode: 'date',
        withTimezone: true,
      })
      .$onUpdate(() => new Date()),
  }),
  (table) => [
    index('idx_users_name').on(table.name),
    index('users_created_at').on(table.createdAt),
    index('users_updated_at').on(table.updatedAt),
  ],
);

export type UserEntity = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  ingressos: many(ingressos),
  pedidos: many(pedidos),
}));
