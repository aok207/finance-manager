"use server";

import { db } from "@/db";
import { transactions } from "@/db/schemas/transaction-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and, inArray } from "drizzle-orm";
import { updateAccountBalance } from "@/modules/accounts/api/actions";

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

    // Update account balance
    await updateAccountBalance(accountId, amount, session.user.id);

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    return { success: true, transaction: newTransaction[0] };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function updateTransaction(
  id: string,
  {
    date,
    amount,
    payee,
    accountId,
    categoryId,
    note,
  }: {
    date: Date;
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

    // Get the old transaction to calculate balance difference
    const oldTransaction = await db
      .select()
      .from(transactions)
      .where(
        and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
      )
      .limit(1);

    if (!oldTransaction.length) {
      throw new Error("Transaction not found");
    }

    const updatedTransaction = await db
      .update(transactions)
      .set({
        date,
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

    // Update account balances
    const old = oldTransaction[0];
    
    // If account changed, update both old and new accounts
    if (old.accountId !== accountId) {
      // Reverse old transaction from old account
      await updateAccountBalance(old.accountId, -old.amount, session.user.id);
      // Add new transaction to new account
      await updateAccountBalance(accountId, amount, session.user.id);
    } else {
      // Same account, just update the difference
      const difference = amount - old.amount;
      if (difference !== 0) {
        await updateAccountBalance(accountId, difference, session.user.id);
      }
    }

    revalidatePath("/transactions");
    revalidatePath("/accounts");
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

    // Get the transaction before deleting to update account balance
    const transaction = await db
      .select()
      .from(transactions)
      .where(
        and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
      )
      .limit(1);

    if (!transaction.length) {
      throw new Error("Transaction not found");
    }

    await db
      .delete(transactions)
      .where(
        and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
      );

    // Reverse the transaction amount from account balance
    await updateAccountBalance(
      transaction[0].accountId,
      -transaction[0].amount,
      session.user.id
    );

    revalidatePath("/transactions");
    revalidatePath("/accounts");
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

    // Get all transactions before deleting to update account balances
    const transactionsToDelete = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.user.id),
          inArray(transactions.id, ids)
        )
      );

    await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.userId, session.user.id),
          inArray(transactions.id, ids)
        )
      );

    // Update account balances for each deleted transaction
    for (const transaction of transactionsToDelete) {
      await updateAccountBalance(
        transaction.accountId,
        -transaction.amount,
        session.user.id
      );
    }

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting transactions:", error);
    return { success: false, error: "Failed to bulk delete transactions" };
  }
}
