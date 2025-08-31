import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DataTablePagination } from "./pagination";
import { TableSkeleton } from "./table-skeleton";
import { Input } from "../ui/input";
import { Search, Trash } from "lucide-react";
import { Button } from "../ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  filterKey: string;
  onBulkDelete?: (selectedRows: TData[]) => void;
  disabled?: boolean;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  filterKey,
  onBulkDelete,
  disabled = false,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />

          <Input
            placeholder={`Filter ${filterKey}...`}
            value={
              (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-full pl-10"
          />
        </div>

        {onBulkDelete &&
          table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant={"destructive"}
              size={"sm"}
              disabled={disabled}
              onClick={() =>
                onBulkDelete?.(
                  table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original)
                )
              }
            >
              <Trash /> {disabled ? "Deleting..." : "Delete"} (
              {table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
      </div>

      <div className="mt-5 rounded-md border">
        {data === undefined ? (
          <TableSkeleton />
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="my-2 w-full">
              <DataTablePagination table={table} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataTable;
