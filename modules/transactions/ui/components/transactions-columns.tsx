"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ColumnDef } from "@tanstack/react-table";
import ColumnActions from "./column-actions";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<{
  id: string;
  amount: number;
  payee: string;
  accountId: string;
  categoryId?: string | null;
  note: string | null;
  date: Date;
  account: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
}>[] = [
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
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "payee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payee" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      const isIncome = amount > 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MMK",
        minimumFractionDigits: 0,
      }).format(Math.abs(amount));

      return (
        <span className={isIncome ? "text-green-600" : "text-red-600"}>
          {isIncome ? "+" : "-"}
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: "account.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => {
      const account = row.original.account;
      return account ? account.name : "Unknown Account";
    },
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return category ? category.name : "No Category";
    },
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Note" />
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return <ColumnActions transaction={transaction} />;
    },
  },
];
