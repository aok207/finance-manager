"use server";

import { db } from "@/db";
import { transactions } from "@/db/schemas/transaction-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and, inArray } from "drizzle-orm";

export async function createTransaction({
  amount,
  payee,
  accountId,
  categoryId,
  note,
  date,
}: {
  amount: number;
  payee: string;
  accountId: string;
  categoryId?: string | null;
  note?: string | null;
  date?: Date;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const newTransaction = await db
      .insert(transactions)
      .values({
        amount,
        payee,
        accountId,
        categoryId: categoryId || null,
        note: note ?? null,
        date: date ?? new Date(),
        userId: session.user.id,
      })
      .returning();

    revalidatePath("/transactions");
    return { success: true, transaction: newTransaction[0] };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function updateTransaction(
  id: string,
  {
    amount,
    payee,
    accountId,
    categoryId,
    note,
  }: {
    amount: number;
    payee: string;
    accountId: string;
    categoryId?: string | null;
    note?: string | null;
  }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const updatedTransaction = await db
      .update(transactions)
      .set({
        amount,
        payee,
        accountId,
        categoryId: categoryId || null,
        note: note ?? null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
      )
      .returning();

    revalidatePath("/transactions");
    return { success: true, transaction: updatedTransaction[0] };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(transactions)
      .where(
        and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
      );

    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}

export async function bulkDeleteTransactions(ids: string[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.userId, session.user.id),
          inArray(transactions.id, ids)
        )
      );

    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting transactions:", error);
    return { success: false, error: "Failed to bulk delete transactions" };
  }
}
