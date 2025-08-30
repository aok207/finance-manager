"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { BalanceAccount } from "@/db/schemas/account-schema";
import { ColumnDef } from "@tanstack/react-table";
import ColumnActions from "./column-actions";

export const columns: ColumnDef<BalanceAccount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const account = row.original;

      return <ColumnActions account={account} />;
    },
  },
];
