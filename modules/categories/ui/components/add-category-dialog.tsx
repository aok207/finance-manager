"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddCategoryForm } from "./add-category-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AddCategoryDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Category</SheetTitle>
          <SheetDescription>
            Create a new category to track your finances
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <AddCategoryForm onClose={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
