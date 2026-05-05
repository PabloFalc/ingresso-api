import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { orders } from './order.table';
import { events } from './event.table';
import { users } from './better-auth/users.table';
import { pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const ticketStatus = pgEnum('ticket_status', [
  'VALIDO',
  'USADO',
  'CANCELADO',
]);

export const tickets = pgTable('tickets', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  orderId: t
    .text('orderId')
    .references(() => orders.id)
    .notNull(),
  eventId: t
    .text('eventId')
    .references(() => events.id)
    .notNull(),
  userId: t
    .text('userId')
    .references(() => users.id)
    .notNull(),
  status: ticketStatus('status').default('VALIDO').notNull(),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
}));

export const ticketRelations = relations(tickets, ({ one }) => ({
  order: one(orders, {
    fields: [tickets.orderId],
    references: [orders.id],
  }),

  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),

  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
}));
