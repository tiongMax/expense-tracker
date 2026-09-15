import { pgTable, uuid, numeric, text, date, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  category: text('category').notNull(),
  description: text('description'),
  date: date('date').notNull().default(sql`current_date`),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: text('category').notNull(),
  monthly_limit: numeric('monthly_limit', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [uniqueIndex('budgets_category_currency_unique').on(table.category, table.currency)]);
