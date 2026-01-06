"use client";

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

interface GenericColumnActionsProps<T extends { id: string }> {
  /**
   * The entity to perform actions on
   */
  entity: T;

  /**
   * Edit dialog component
   */
  EditDialog: React.ComponentType<{ entity: T; onClose?: () => void }>;

  /**
   * Delete dialog component
   */
  DeleteDialog: React.ComponentType<{ entity: T }>;
}

export function GenericColumnActions<T extends { id: string }>({
  entity,
  EditDialog,
  DeleteDialog,
}: GenericColumnActionsProps<T>) {
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
          <EditDialog entity={entity} />
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DeleteDialog entity={entity} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
