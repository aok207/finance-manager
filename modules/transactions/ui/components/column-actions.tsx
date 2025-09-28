import React from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import { getCategories } from "@/modules/categories/api/queries";
import { getAccounts } from "@/modules/accounts/api/queries";

function ColumnActions({
  transaction,
}: {
  transaction: {
    id: string;
    amount: number;
    payee: string;
    accountId: string;
    categoryId?: string | null;
    note?: string | null;
    date: Date;
    account: { id: string; name: string } | null;
    category: { id: string; name: string } | null;
  };
}) {
  // const categories = await getCategories();
  // const accounts = await getAccounts();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <EditTransactionDialog transaction={transaction} />
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DeleteTransactionDialog transaction={transaction} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ColumnActions;
