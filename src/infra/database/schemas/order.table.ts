import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './better-auth/users.table';
import { timestampIso } from './shared/timestamps';
import { relations } from 'drizzle-orm';
import { pedidoItens } from './order-items.table';

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
    .text('user_id')
    .references(() => users.id)
    .notNull(),
  quantidadeTotal: t.integer('quantidade_total').notNull().default(1),
  status: pedidoStatus('status').default('PENDENTE').notNull(),
  criadoEm: timestampIso('criado_em', {
    mode: 'string',
    withTimezone: false,
  })
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  atualizadoEm: timestampIso('atualizado_em', {
    mode: 'string',
    withTimezone: false,
  }).$onUpdate(() => new Date().toISOString()),
}));

export const pedidosRelations = relations(pedidos, ({ one, many }) => ({
  user: one(users, {
    fields: [pedidos.userId],
    references: [users.id],
  }),
  itens: many(pedidoItens),
}));
