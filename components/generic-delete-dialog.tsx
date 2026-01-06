"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ApiResponse } from "@/types/api";

interface GenericDeleteDialogProps<T extends { id: string }> {
  /**
   * The entity to delete
   */
  entity: T;

  /**
   * Display name of the entity (e.g., the name field to show in confirmation)
   */
  entityDisplayName: string;

  /**
   * Type name for display purposes (e.g., "Transaction", "Account", "Category")
   */
  entityTypeName: string;

  /**
   * Server action to call for deletion
   */
  deleteAction: (id: string) => Promise<ApiResponse>;

  /**
   * Custom trigger button (optional)
   */
  trigger?: React.ReactNode;

  /**
   * Show loading spinner icon (default: true)
   */
  showLoadingIcon?: boolean;
}

export function GenericDeleteDialog<T extends { id: string }>({
  entity,
  entityDisplayName,
  entityTypeName,
  deleteAction,
  trigger,
  showLoadingIcon = true,
}: GenericDeleteDialogProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const result = await deleteAction(entity.id);

      if (result.success) {
        toast.success(`${entityTypeName} deleted successfully`);
        router.refresh();
      } else {
        toast.error(result.error || `Failed to delete ${entityTypeName.toLowerCase()}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold">{entityDisplayName}</span> and all
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && showLoadingIcon && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isLoading
              ? `Deleting...`
              : `Delete ${entityTypeName}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
