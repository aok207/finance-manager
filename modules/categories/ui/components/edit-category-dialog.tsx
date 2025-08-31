"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditCategoryForm } from "./edit-category-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface EditCategoryDialogProps {
  category: { id: string; name: string };
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
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
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>
            Update your category information
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <EditCategoryForm
            category={category}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
