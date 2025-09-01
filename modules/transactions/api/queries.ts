"use server";

import { db } from "@/db";
import { transactions as transactionsSchema } from "@/db/schemas/transaction-schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, lte } from "drizzle-orm";
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
    .select()
    .from(transactionsSchema)
    .where(and(...whereClauses))
    .orderBy(transactionsSchema.createdAt);

  return {
    success: true,
    data: transactions,
  };
}
