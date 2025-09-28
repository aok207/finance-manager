"use client";

import { useState, useEffect } from "react";
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
import { getAccounts } from "@/modules/accounts/api/queries";
import { getCategories } from "@/modules/categories/api/queries";
import { Spinner } from "@/modules/auth/ui/components/spinner";

interface EditTransactionDialogProps {
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
}

export function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOptions, setAccountOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);

        const accounts = (accountsRes.data ?? []).map((account) => ({
          label: account.name,
          value: account.id,
        }));

        const categories = (categoriesRes.data ?? []).map((category) => ({
          label: category.name,
          value: category.id,
        }));

        setAccountOptions(accounts);
        setCategoryOptions(categories);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

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
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          ) : (
            <EditTransactionForm
              transaction={transaction}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
