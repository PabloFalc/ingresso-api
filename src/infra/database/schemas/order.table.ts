import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './better-auth/users.table';
import { timestamps } from './shared/timestamps';
import { relations } from 'drizzle-orm';

export const orderStatus = pgEnum('orders_status', [
  'PENDENTE',
  'PAGO',
  'CANCELADO',
]);

export const orders = pgTable('orders', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: t
    .text('userId')
    .references(() => users.id)
    .notNull(),
  totalAmount: t.integer().notNull().default(1),
  status: orderStatus('status').default('PENDENTE').notNull(),
  ...timestamps,
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
