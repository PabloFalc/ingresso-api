import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { pedidos } from './order.table';
import { tipoIngresso } from './ticket-order.table';
import { eventos } from './event.table';
import { relations } from 'drizzle-orm';

export const pedidoItens = pgTable('pedido_itens', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  pedidoId: t
    .text('pedidoId')
    .references(() => pedidos.id, { onDelete: 'cascade' })
    .notNull(),
  tipoIngressoId: t
    .text('tipoIngressoId')
    .references(() => tipoIngresso.id)
    .notNull(),
  eventoId: t
    .text('eventoId')
    .references(() => eventos.id)
    .notNull(),
  quantidade: t.integer('quantidade').notNull().default(1),
  precoUnitario: t.integer('precoUnitario').notNull(),
}));

export const pedidoItensRelations = relations(pedidoItens, ({ one }) => ({
  pedido: one(pedidos, {
    fields: [pedidoItens.pedidoId],
    references: [pedidos.id],
  }),
  tipoIngresso: one(tipoIngresso, {
    fields: [pedidoItens.tipoIngressoId],
    references: [tipoIngresso.id],
  }),
  evento: one(eventos, {
    fields: [pedidoItens.eventoId],
    references: [eventos.id],
  }),
}));
