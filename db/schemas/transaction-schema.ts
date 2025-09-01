import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { balanceAccounts } from "./account-schema";
import { categories } from "./category-schema";
import { relations } from "drizzle-orm";

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    amount: integer("amount").notNull(),
    payee: varchar("payee").notNull(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => balanceAccounts.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    note: text("note"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: timestamp("date", { mode: "date" }).notNull().defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [index("balance_account_id_transaction").on(table.accountId)]
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(balanceAccounts, {
    fields: [transactions.accountId],
    references: [balanceAccounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export type BalanceAccount = typeof transactions.$inferSelect;
