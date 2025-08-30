"use client";

import DataTable from "@/components/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./accounts-columns";
import { BalanceAccount } from "@/db/schemas/account-schema";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface AccountsTableProps {
  accounts: BalanceAccount[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}

function AccountsTable({
  accounts,
  totalCount,
  currentPage,
  pageSize,
  searchQuery,
}: AccountsTableProps) {
  const [pagination, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({ pageIndex: currentPage - 1, pageSize });

  const [searchFilter, setSearchFilter] = useState(searchQuery);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync search filter with URL params on mount
  useEffect(() => {
    setSearchFilter(searchQuery);
  }, [searchQuery]);

  // Update pagination when props change
  useEffect(() => {
    setPagination({ pageIndex: currentPage - 1, pageSize });
  }, [currentPage, pageSize]);

  const handleSearchChange = (value: string) => {
    setSearchFilter(value);

    // Debounce the search to avoid excessive API calls
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (value.trim() === "") {
        params.delete("query");
      } else {
        params.set("query", value);
      }

      // Reset to first page when searching
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handlePaginationChange = (
    newPagination: React.SetStateAction<{ pageIndex: number; pageSize: number }>
  ) => {
    if (typeof newPagination === "function") {
      const result = newPagination(pagination);
      setPagination(result);

      const params = new URLSearchParams(searchParams);
      params.set("page", String(result.pageIndex + 1));
      params.set("pageSize", String(result.pageSize));

      router.push(`${pathname}?${params.toString()}`);
    } else {
      setPagination(newPagination);

      const params = new URLSearchParams(searchParams);
      params.set("page", String(newPagination.pageIndex + 1));
      params.set("pageSize", String(newPagination.pageSize));

      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search accounts..."
          className="w-full max-w-sm pl-10"
          value={searchFilter}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchQuery ? (
              <>
                <p className="text-lg font-medium">No accounts found</p>
                <p className="text-sm">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">No accounts yet</p>
                <p className="text-sm">
                  Create your first account to get started
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={accounts}
          pagination={pagination}
          setPagination={handlePaginationChange}
          totalResult={totalCount}
        />
      )}
    </div>
  );
}

export default AccountsTable;
