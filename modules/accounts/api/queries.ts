"use server";

import { db } from "@/db";
import { balanceAccounts, BalanceAccount } from "@/db/schemas/account-schema";
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
    .select({ id: balanceAccounts.id, name: balanceAccounts.name })
    .from(balanceAccounts)
    .where(eq(balanceAccounts.userId, session.user.id))
    .orderBy(balanceAccounts.name);

  return {
    success: true,
    data: accounts,
  };
}
