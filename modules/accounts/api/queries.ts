"use server";

import { db } from "@/db";
import { balanceAccount, BalanceAccount } from "@/db/schemas/account-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getAccounts(): Promise<{
  success: boolean;
  data?: { id: string; name: string }[];
  error?: string;
}> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const accounts = await db
    .select({ id: balanceAccount.id, name: balanceAccount.name })
    .from(balanceAccount)
    .where(eq(balanceAccount.userId, session.user.id))
    .orderBy(balanceAccount.name);

  return {
    success: true,
    data: accounts,
  };
}
