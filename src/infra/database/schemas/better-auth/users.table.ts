import { pgEnum, pgTable, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';
import { timestamps } from '../shared/timestamps';
import { sessions } from './sessions.table';
import { accounts } from '../better-auth/accounts.table';
import { z } from 'zod';

export const userRolesEnum = pgEnum('user_roles', [
  'OWNER',
  'ADMIN',
  'MANAGER',
  'USER',
]);

export const userRoleSchema = z.enum(userRolesEnum.enumValues);

export const users = pgTable(
  'users',
  (t) => ({
    id: t
      .text('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    userName: t.varchar('user_name', { length: 50 }).unique().notNull(),
    name: t.varchar('name', { length: 255 }).notNull(),
    email: t.varchar('email', { length: 255 }).unique().notNull(),
    emailVerified: t.boolean('email_verified').default(false).notNull(),
    // password: t.varchar('password', { length: 100 }).notNull(),
    role: userRolesEnum('role').notNull().default('USER'),
    ...timestamps,
  }),
  (table) => [
    index('idx_users_name').on(table.name),
    index('users_created_at').on(table.createdAt),
    index('users_updated_at').on(table.updatedAt),
    index('users_deleted_at').on(table.deletedAt),
    index('users_role').on(table.role),
  ],
);

export type UserEntity = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));
