import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
import { transactions } from "./transaction-schema";

export const balanceAccounts = pgTable(
  "balance_account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("balance_account_name_user_id_idx").on(
      table.name,
      table.userId
    ),
  ]
);

export const accountsRelations = relations(balanceAccounts, ({ many }) => ({
  transactions: many(transactions),
}));

export type BalanceAccount = typeof balanceAccounts.$inferSelect;
