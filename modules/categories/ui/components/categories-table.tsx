"use client";

import DataTable from "@/components/data-table";
import React, { useState } from "react";
import { columns } from "./categories-columns";
import { bulkDeleteCategories } from "../../api/actions";
import { toast } from "sonner";

interface CategoriesTableProps {
  categories: { id: string; name: string }[];
}

function CategoriesTable({ categories }: CategoriesTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <p className="text-lg font-medium">No categories yet</p>
            <p className="text-sm">
              Create your first category to get started
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          filterKey="name"
          disabled={isDeleting}
          onBulkDelete={async (data) => {
            setIsDeleting(true);
            const ids = data.map((item) => item.id);

            const res = await bulkDeleteCategories(ids);

            setIsDeleting(false);

            if (!res.success) {
              toast.error(res.error || "Failed to delete categories");
              return;
            }

            toast.success("Categories deleted successfully");
          }}
        />
      )}
    </div>
  );
}

export default CategoriesTable;
