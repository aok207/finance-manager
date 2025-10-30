"use server";

import { db } from "@/db";
import { transactions as transactionsSchema } from "@/db/schemas/transaction-schema";
import { balanceAccounts } from "@/db/schemas/account-schema";
import { categories } from "@/db/schemas/category-schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { headers } from "next/headers";

interface GetTransactionsArgs {
  accountId?: string;
  from?: Date;
  to?: Date;
}

export async function getTransactions(args: GetTransactionsArgs = {}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const whereClauses = [eq(transactionsSchema.userId, session.user.id)];

  if (args.accountId) {
    whereClauses.push(eq(transactionsSchema.accountId, args.accountId));
  }
  if (args.from) {
    whereClauses.push(gte(transactionsSchema.createdAt, args.from));
  }
  if (args.to) {
    whereClauses.push(lte(transactionsSchema.createdAt, args.to));
  }

  const transactions = await db
    .select({
      id: transactionsSchema.id,
      amount: transactionsSchema.amount,
      payee: transactionsSchema.payee,
      accountId: transactionsSchema.accountId,
      categoryId: transactionsSchema.categoryId,
      note: transactionsSchema.note,
      date: transactionsSchema.date,
      createdAt: transactionsSchema.createdAt,
      updatedAt: transactionsSchema.updatedAt,
      account: {
        id: balanceAccounts.id,
        name: balanceAccounts.name,
      },
      category: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(transactionsSchema)
    .leftJoin(
      balanceAccounts,
      eq(transactionsSchema.accountId, balanceAccounts.id)
    )
    .leftJoin(categories, eq(transactionsSchema.categoryId, categories.id))
    .where(and(...whereClauses))
    .orderBy(desc(transactionsSchema.date));

  return {
    success: true,
    data: transactions,
  };
}
