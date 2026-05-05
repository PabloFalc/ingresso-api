import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { events } from './event.table';
import { relations } from 'drizzle-orm';

export const ticketOrders = pgTable('ticket_orders', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  eventId: t
    .text('eventId')
    .references(() => events.id)
    .notNull(),
  name: t.varchar('name', { length: 150 }).notNull(),
  price: t.integer('price').notNull().default(0),
  QunatityTotal: t.integer('total').notNull(),
  QuantitySold: t.integer('soldTotal').notNull(),
  saleStart: t.timestamp('saleStart').notNull(),
  saleEnd: t.timestamp('saleEnd').notNull(),
  isActive: t.boolean('isActive').notNull(),
}));

export const ticketOrdersRelations = relations(ticketOrders, ({ one }) => ({
  event: one(events, {
    fields: [ticketOrders.eventId],
    references: [events.id],
  }),
}));
