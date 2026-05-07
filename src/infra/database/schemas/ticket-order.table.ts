import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { eventos } from './event.table';
import { relations } from 'drizzle-orm';
import { timestampIso } from './shared/timestamps';

export const tipoIngresso = pgTable('tipo_ingresso', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  eventoId: t
    .text('evento_id')
    .references(() => eventos.id, { onDelete: 'cascade' })
    .notNull(),
  nome: t.varchar('nome', { length: 150 }).notNull(),
  preco: t.integer('preco').notNull().default(0),
  quantidadeTotal: t.integer('quantidade_total').notNull(),
  quantidadeVendida: t.integer('quantidade_vendida').default(0).notNull(),
  inicioVenda: timestampIso('inicio_venda').notNull(),
  fimVenda: timestampIso('fim_venda').notNull(),
  ativo: t.boolean('ativo').notNull(),
}));

export const tipoIngressoRelations = relations(tipoIngresso, ({ one }) => ({
  event: one(eventos, {
    fields: [tipoIngresso.eventoId],
    references: [eventos.id],
  }),
}));
