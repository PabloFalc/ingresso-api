import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { address } from './shared/address.table';
import { users } from './better-auth/users.table';
import { timestamps } from './shared/timestamps';
import { relations } from 'drizzle-orm';

export const eventsStatus = pgEnum('status_event', [
  'RASCUNHO',
  'PUBLICADO',
  'CANCELADO',
]);

export const events = pgTable('events', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  title: t.varchar('title', { length: 150 }).notNull(),
  description: t.text(),
  startDate: t.timestamp().notNull(),
  endDate: t.timestamp().notNull(),
  status: eventsStatus('status').default('RASCUNHO'),
  addressId: t
    .text('address_id')
    .notNull()
    .references(() => address.id, { onDelete: 'cascade' }),
  organizerId: t
    .text('organizerId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
}));

export const eventsRelations = relations(events, ({ one }) => ({
  address: one(address, {
    fields: [events.addressId],
    references: [address.id],
  }),

  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
}));
