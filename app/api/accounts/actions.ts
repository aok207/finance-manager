"use server";

import { db } from "@/db";
import { balanceAccount } from "@/db/schemas/account-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function createAccount(name: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const newAccount = await db
      .insert(balanceAccount)
      .values({
        name,
        userId: session.user.id,
      })
      .returning();

    revalidatePath("/accounts");
    return { success: true, account: newAccount[0] };
  } catch (error) {
    console.error("Error creating account:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function updateAccount(id: string, name: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const updatedAccount = await db
      .update(balanceAccount)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(balanceAccount.id, id),
          eq(balanceAccount.userId, session.user.id)
        )
      )
      .returning();

    revalidatePath("/accounts");
    return { success: true, account: updatedAccount[0] };
  } catch (error) {
    console.error("Error updating account:", error);
    return { success: false, error: "Failed to update account" };
  }
}

export async function deleteAccount(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(balanceAccount)
      .where(
        and(
          eq(balanceAccount.id, id),
          eq(balanceAccount.userId, session.user.id)
        )
      );

    revalidatePath("/accounts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
