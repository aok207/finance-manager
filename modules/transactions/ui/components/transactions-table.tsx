"use client";

import DataTable from "@/components/data-table";
import React, { useState } from "react";
import { columns } from "./transactions-columns";
import { bulkDeleteTransactions } from "../../api/actions";
import { toast } from "sonner";

interface TransactionsTableProps {
  transactions: {
    id: string;
    amount: number;
    payee: string;
    accountId: string;
    note: string | null;
  }[];
}

function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm">
              Create your first transaction to get started
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          filterKey="payee"
          disabled={isDeleting}
          onBulkDelete={async (data) => {
            setIsDeleting(true);
            const ids = data.map((item) => item.id);

            const res = await bulkDeleteTransactions(ids);

            setIsDeleting(false);

            if (!res.success) {
              toast.error(res.error || "Failed to delete transactions");
              return;
            }

            toast.success("Transactions deleted successfully");
          }}
        />
      )}
    </div>
  );
}

export default TransactionsTable;
