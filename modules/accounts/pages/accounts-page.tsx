import React from "react";
import AccountsTable from "../ui/components/accounts-table";
import { AddAccountDialog } from "../ui/components/add-account-dialog";

interface AccountsPageProps {
  accounts: { id: string; name: string }[];
}

const AccountsPage = ({ accounts }: AccountsPageProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
        <AddAccountDialog />
      </div>

      <AccountsTable accounts={accounts} />
    </div>
  );
};

export default AccountsPage;
