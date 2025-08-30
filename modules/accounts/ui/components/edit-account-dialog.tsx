"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditAccountForm } from "./edit-account-form";
import { BalanceAccount } from "@/db/schemas/account-schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface EditAccountDialogProps {
  account: BalanceAccount;
}

export function EditAccountDialog({ account }: EditAccountDialogProps) {
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
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Update your account information</SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <EditAccountForm account={account} onClose={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
