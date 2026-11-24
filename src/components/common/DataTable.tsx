import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/utils/cn';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: TData) => void;
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display matching the current criteria.',
  onRowClick,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#e5e2d9] bg-white p-4">
        <div className="space-y-2.5">
          <Skeleton className="h-8 w-full bg-[#eeece6]" />
          <Skeleton className="h-10 w-full bg-[#f6f5f0]" />
          <Skeleton className="h-10 w-full bg-[#f6f5f0]" />
          <Skeleton className="h-10 w-full bg-[#f6f5f0]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Table Container */}
      <div className="rounded-xl border border-[#e5e2d9] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-stone-800">
            <thead className="bg-[#faf9f5] text-[11px] font-semibold text-stone-500 border-b border-[#e5e2d9]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 font-semibold text-stone-600 select-none whitespace-nowrap"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'flex items-center gap-1.5',
                              header.column.getCanSort() && 'cursor-pointer hover:text-stone-900'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-stone-400">
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ArrowUp className="h-3.5 w-3.5 text-[#e05842]" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ArrowDown className="h-3.5 w-3.5 text-[#e05842]" />
                                ) : (
                                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#f2efe8] bg-white">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={cn(
                      'transition-colors hover:bg-[#faf9f5]',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2.5 text-stone-700 whitespace-nowrap text-xs"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-44 text-center p-6"
                  >
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {table.getRowModel().rows?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-[#e5e2d9] px-4 py-2.5 text-xs text-stone-500 bg-[#faf9f5]">
            <div className="text-stone-600">
              Showing{' '}
              <span className="font-semibold text-stone-900">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-stone-900">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-stone-900">
                {table.getFilteredRowModel().rows.length}
              </span>{' '}
              entries
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 font-medium text-stone-700 text-xs">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount() || 1}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
