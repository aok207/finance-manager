import { Account } from "@/db/schemas/account-schema";
import { Transaction } from "@/db/schemas/transaction-schema";
import { Category } from "@/db/schemas/category-schema";

/**
 * Re-export database schema types for centralized access
 */
export type { Account, Transaction, Category };

/**
 * Account with formatted balance
 */
export interface AccountWithBalance {
  id: string;
  name: string;
  balance: number;
}

/**
 * Transaction with related account and category details
 */
export interface TransactionWithRelations extends Transaction {
  account?: {
    id: string;
    name: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Simple account select option
 */
export interface AccountOption {
  id: string;
  name: string;
}

/**
 * Simple category select option
 */
export interface CategoryOption {
  id: string;
  name: string;
}
