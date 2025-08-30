import { Input } from "@/components/ui/input";
import React from "react";
import AccountsTable from "../ui/components/accounts-table";
import { BalanceAccount } from "@/db/schemas/account-schema";
import { AddAccountDialog } from "../ui/components/add-account-dialog";

interface AccountsPageProps {
  accounts: BalanceAccount[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}

const AccountsPage = ({
  accounts,
  totalCount,
  currentPage,
  pageSize,
  searchQuery,
}: AccountsPageProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
        <AddAccountDialog />
      </div>

      <AccountsTable
        accounts={accounts}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default AccountsPage;
