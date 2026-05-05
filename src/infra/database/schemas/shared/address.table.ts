import { pgTable } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const address = pgTable('adress', (t) => ({
  id: t
    .text('adress_id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  streetAdress: t.varchar('street_address', { length: 100 }).notNull(),
  zipCode: t.varchar('zip_code', { length: 9 }).notNull(),
  number: t.integer('number').notNull(),
  addition: t.varchar('addition'),
  city: t.varchar('city', { length: 100 }).notNull(),
  state: t.varchar('state', { length: 100 }).notNull(),
  country: t.varchar('country', { length: 100 }).notNull(),
}));
