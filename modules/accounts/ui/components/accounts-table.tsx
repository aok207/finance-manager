"use client";

import { GenericTableWrapper } from "@/components/generic-table-wrapper";
import { columns } from "./accounts-columns";
import { bulkDeleteAccounts } from "../../api/actions";

interface AccountsTableProps {
  accounts: { id: string; name: string; balance: number }[];
}

function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <GenericTableWrapper
      data={accounts}
      columns={columns}
      filterKey="name"
      entityTypeName="accounts"
      bulkDeleteAction={bulkDeleteAccounts}
    />
  );
}

export default AccountsTable;
