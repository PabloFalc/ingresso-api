import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { eventos } from './event.table';
import { relations } from 'drizzle-orm';

export const tipoIngresso = pgTable('tipo_ingresso', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  eventoId: t
    .text('eventoId')
    .references(() => eventos.id)
    .notNull(),
  nome: t.varchar('nome', { length: 150 }).notNull(),
  preco: t.integer('preco').notNull().default(0),
  quantidadeTotal: t.integer('total').notNull(),
  quantidadeVendida: t.integer('quantidadeVendida').notNull(),
  inicioVenda: t.timestamp('inicioVenda').notNull(),
  fimVenda: t.timestamp('fimVenda').notNull(),
  ativo: t.boolean('ativo').notNull(),
}));

export const tipoIngressoRelations = relations(tipoIngresso, ({ one }) => ({
  event: one(eventos, {
    fields: [tipoIngresso.eventoId],
    references: [eventos.id],
  }),
}));
