"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { BalanceAccount } from "@/db/schemas/account-schema";
import { ColumnDef } from "@tanstack/react-table";
import ColumnActions from "./column-actions";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<{ id: string; name: string }>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
