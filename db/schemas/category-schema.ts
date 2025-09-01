// import { pgTable, uuid } from "drizzle-orm/pg-core";

// export const category = pgTable("category", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     name: uuid
// })
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

export const categories = pgTable(
  "categories",
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
    uniqueIndex("category_name_user_id_idx").on(table.name, table.userId),
  ]
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export type BalanceAccount = typeof categories.$inferSelect;
