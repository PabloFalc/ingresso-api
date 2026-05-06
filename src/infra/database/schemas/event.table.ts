import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './better-auth/users.table';
import { timestamps } from './shared/timestamps';
import { relations } from 'drizzle-orm';

export const eventosStatus = pgEnum('status_evento', [
  'RASCUNHO',
  'PUBLICADO',
  'CANCELADO',
]);

export const eventos = pgTable('eventos', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  titulo: t.varchar('titulo', { length: 150 }).notNull(),
  descricao: t.text('descricao'),
  dataInicio: t.timestamp('data_inicio').notNull(),
  dataFim: t.timestamp('data_fim').notNull(),
  status: eventosStatus('status').default('RASCUNHO'),
  local: t.varchar('local').notNull(),
  organizadorId: t
    .text('organizadorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
}));

export const eventosRelations = relations(eventos, ({ one }) => ({
  organizador: one(users, {
    fields: [eventos.organizadorId],
    references: [users.id],
  }),
}));
