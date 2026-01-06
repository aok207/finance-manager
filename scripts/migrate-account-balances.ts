import { db } from "@/db";
import { balanceAccounts } from "@/db/schemas/account-schema";
import { transactions } from "@/db/schemas/transaction-schema";
import { eq, sql } from "drizzle-orm";

/**
 * Data migration script to calculate and set initial balances for all accounts
 * based on their existing transactions.
 * 
 * This script:
 * 1. Fetches all accounts
 * 2. For each account, calculates the sum of all transaction amounts
 * 3. Updates the account's balance field with the calculated total
 * 
 * Safe to run multiple times (idempotent).
 */
async function migrateAccountBalances() {
  console.log("Starting account balance migration...\n");

  try {
    // Get all accounts
    const accounts = await db.select().from(balanceAccounts);

    console.log(`Found ${accounts.length} accounts to process.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const account of accounts) {
      try {
        // Calculate total from transactions for this account
        const result = await db
          .select({ 
            total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` 
          })
          .from(transactions)
          .where(eq(transactions.accountId, account.id));

        const calculatedBalance = result[0]?.total || 0;

        // Update account balance
        await db
          .update(balanceAccounts)
          .set({ 
            balance: calculatedBalance,
            updatedAt: new Date() 
          })
          .where(eq(balanceAccounts.id, account.id));

        console.log(
          `✓ Updated "${account.name}" (${account.id}): balance = ${calculatedBalance}`
        );
        successCount++;
      } catch (error) {
        console.error(
          `✗ Error updating "${account.name}" (${account.id}):`,
          error
        );
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("Migration Summary:");
    console.log(`Total accounts: ${accounts.length}`);
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log("=".repeat(60));

    if (errorCount > 0) {
      console.error("\n⚠️  Migration completed with errors!");
      process.exit(1);
    } else {
      console.log("\n✓ Migration completed successfully!");
      process.exit(0);
    }
  } catch (error) {
    console.error("\n✗ Fatal error during migration:", error);
    process.exit(1);
  }
}

// Run migration
migrateAccountBalances();
