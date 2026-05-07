import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { pedidos } from './order.table';
import { eventos } from './event.table';
import { users } from './better-auth/users.table';
import { pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestampIso } from './shared/timestamps';

export const ingressoStatus = pgEnum('ingresso_status', [
  'VALIDO',
  'USADO',
  'CANCELADO',
]);

export const ingressos = pgTable('ingressos', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  pedidoId: t
    .text('pedido_id')
    .references(() => pedidos.id, { onDelete: 'set null' }),
  eventoId: t
    .text('evento_id')
    .references(() => eventos.id)
    .notNull(),
  userId: t
    .text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  status: ingressoStatus('status').default('VALIDO').notNull(),
  criadoEm: timestampIso('criadoEm')
    .notNull()
    .default(new Date().toISOString()),
}));

export const ticketRelations = relations(ingressos, ({ one }) => ({
  pedido: one(pedidos, {
    fields: [ingressos.pedidoId],
    references: [pedidos.id],
  }),

  event: one(eventos, {
    fields: [ingressos.eventoId],
    references: [eventos.id],
  }),

  user: one(users, {
    fields: [ingressos.userId],
    references: [users.id],
  }),
}));
