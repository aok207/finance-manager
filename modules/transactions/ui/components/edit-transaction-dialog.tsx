"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditTransactionForm } from "./edit-transaction-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface EditTransactionDialogProps {
  transaction: {
    id: string;
    amount: number;
    payee: string;
    accountId: string;
    note?: string | null;
  };
}

export function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Update your transaction information
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <EditTransactionForm
            transaction={transaction}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
