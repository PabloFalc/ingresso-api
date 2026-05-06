import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './better-auth/users.table';
import { timestamps } from './shared/timestamps';
import { relations } from 'drizzle-orm';

export const pedidoStatus = pgEnum('pedido_status', [
  'PENDENTE',
  'PAGO',
  'CANCELADO',
]);

export const pedidos = pgTable('pedidos', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: t
    .text('userId')
    .references(() => users.id)
    .notNull(),
  quantidadeTotal: t.integer().notNull().default(1),
  status: pedidoStatus('status').default('PENDENTE').notNull(),
  ...timestamps,
}));

export const pedidosRelations = relations(pedidos, ({ one }) => ({
  user: one(users, {
    fields: [pedidos.userId],
    references: [users.id],
  }),
}));
