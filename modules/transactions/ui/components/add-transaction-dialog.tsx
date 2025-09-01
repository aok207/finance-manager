"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddTransactionForm } from "./add-transaction-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AddTransactionDialog({
  categories,
  accounts,
}: {
  categories: { label: string; value: string }[];
  accounts: { label: string; value: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto py-4">
        <SheetHeader>
          <SheetTitle>Add New Transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction to track your finances
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <AddTransactionForm
            onClose={() => setIsOpen(false)}
            categories={categories}
            accounts={accounts}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
