import React from "react";
import TransactionsTable from "../ui/components/transactions-table";
import { AddTransactionDialog } from "../ui/components/add-transaction-dialog";
import { getCategories } from "@/modules/categories/api/queries";
import { getAccounts } from "@/modules/accounts/api/queries";
import FilterDropdowns from "@/modules/dashboard/ui/components/filter-dropdowns";

interface TransactionsPageProps {
  transactions: {
    id: string;
    amount: number;
    payee: string;
    accountId: string;
    categoryId?: string | null;
    note: string | null;
    date: Date;
    account: { id: string; name: string } | null;
    category: { id: string; name: string } | null;
  }[];
  selectedAccountId: string;
  selectedPeriod: string;
  dateRange: { from: Date; to: Date };
}

const TransactionsPage = async ({
  transactions,
  selectedAccountId,
  selectedPeriod,
  dateRange,
}: TransactionsPageProps) => {
  const { data: categories } = await getCategories();

  const categoriesOptions = (categories ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const { data: accounts } = await getAccounts();

  const accountsOptions = (accounts ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <AddTransactionDialog
          categories={categoriesOptions}
          accounts={accountsOptions}
        />
      </div>

      <FilterDropdowns
        accounts={accounts ?? []}
        selectedAccountId={selectedAccountId}
        selectedPeriod={selectedPeriod}
        dateRange={dateRange}
      />

      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default TransactionsPage;
