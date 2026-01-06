"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/data-table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/api";

interface GenericTableWrapperProps<T> {
  /**
   * Array of data to display in the table
   */
  data: T[];

  /**
   * Column definitions for the table
   */
  columns: ColumnDef<T, unknown>[];

  /**
   * Key to use for filtering (e.g., "name", "payee")
   */
  filterKey: string;

  /**
   * Entity type name for messages (e.g., "transactions", "accounts")
   */
  entityTypeName: string;

  /**
   * Bulk delete server action
   */
  bulkDeleteAction: (ids: string[]) => Promise<ApiResponse>;

  /**
   * Custom empty state configuration
   */
  emptyState?: {
    title: string;
    description: string;
  };
}

export function GenericTableWrapper<T extends { id: string }>({
  data,
  columns,
  filterKey,
  entityTypeName,
  bulkDeleteAction,
  emptyState,
}: GenericTableWrapperProps<T>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const defaultEmptyState = {
    title: `No ${entityTypeName} yet`,
    description: `Create your first ${entityTypeName.slice(0, -1)} to get started`,
  };

  const emptyConfig = emptyState || defaultEmptyState;

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">
            {emptyConfig.title}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {emptyConfig.description}
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          filterKey={filterKey}
          disabled={isDeleting}
          onBulkDelete={async (selectedRows: T[]) => {
            setIsDeleting(true);
            try {
              const ids = selectedRows.map((item: T) => item.id);
              const result = await bulkDeleteAction(ids);

              if (result.success) {
                toast.success(
                  `Successfully deleted ${ids.length} ${
                    ids.length === 1
                      ? entityTypeName.slice(0, -1)
                      : entityTypeName
                  }`
                );
                router.refresh();
              } else {
                toast.error(
                  result.error || `Failed to delete ${entityTypeName}`
                );
              }
            } catch (error) {
              toast.error("An unexpected error occurred");
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      )}
    </div>
  );
}
