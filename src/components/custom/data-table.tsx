"use client"

import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
  Table as ReactTable,
} from "@tanstack/react-table"
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseType } from "@/types/commonTypes"
import { DataTableToolbar } from "./dataTableToolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterableColumns?: string[]
  bulkAction?: boolean
  bulkActionsHeader?: React.ComponentType<{ table: ReactTable<TData> }>
  manualPagination?: boolean
  pagination?: {
    page: number
    limit: number
    total?: number
    pages?: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }
  onPaginationChange?: (page: number, limit: number) => void
  isLoading?: boolean
}



export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  bulkAction = false,
  bulkActionsHeader,
  manualPagination = false,
  pagination = {
    page: 1,
    limit: 10,
  },
  onPaginationChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [isIOS, setIsIOS] = useState(false)
  const [internalPageIndex, setInternalPageIndex] = useState(0)
  const [internalPageSize, setInternalPageSize] = useState(pagination?.limit || 10)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
  }, [])

  const table = useReactTable<TData>({
    data,
    columns,
    ...(manualPagination ? {
      manualPagination: true
    } : {}),
    ...(manualPagination ? { pageCount: pagination?.pages } : {}),
    ...(manualPagination ? {
      initialState: {
        pagination: {
          pageIndex: internalPageIndex,
          pageSize: internalPageSize,
        }
        ,
      }
    } : {
      initialState: {
        pagination: {
          pageSize: 10,
        }
      }
    })
    ,
    state: {
      columnFilters,
      globalFilter,
      sorting,
      ...(manualPagination ? {
        pagination: {
          pageIndex: pagination.page - 1, // Convert to zero-based index
          pageSize: pagination.limit,
        }
      } : {})
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(!manualPagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

  })


  const handlePageChange = (newPage: number) => {
    if (manualPagination && onPaginationChange) {
      onPaginationChange(newPage + 1, internalPageSize)
    } else {
      table.setPageIndex(newPage)
    }
    setInternalPageIndex(newPage)
  }

  const handlePageSizeChange = (newLimit: number) => {
    if (manualPagination && onPaginationChange) {
      onPaginationChange(1, newLimit)
      setInternalPageIndex(0)
    } else {
      table.setPageIndex(0)
      table.setPageSize(newLimit)
    }
    setInternalPageSize(newLimit)
  }


  const pageCount = manualPagination
    ? pagination?.pages || Math.ceil((pagination?.total || 0) / internalPageSize)
    : table.getPageCount()

  const canPreviousPage = manualPagination
    ? pagination?.hasPrevPage ?? (internalPageIndex > 0)
    : table.getCanPreviousPage()

  const canNextPage = manualPagination
    ? pagination?.hasNextPage ?? (internalPageIndex < pageCount - 1)
    : table.getCanNextPage()


  return (
    <div className="space-y-4">
      {/* Mobile-Optimized Filters */}
      <div className="flex flex-col gap-3">
        <div className="w-full">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-full sm:max-w-sm focus:ring-0 focus:ring-offset-0 focus:outline-none"
            />
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {bulkAction && <div className="flex justify-end">
          <DataTableToolbar<TData> table={table} bulkActionsHeader={bulkActionsHeader} />
        </div>}

        <div className="flex flex-wrap gap-2">
          {filterableColumns.map(columnId => {
            const column = table.getColumn(columnId)
            if (!column) return null
            return (
              <Input
                key={columnId}
                placeholder={`Filter ${columnId}`}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(e) => column.setFilterValue(e.target.value)}
                className="min-w-[120px] flex-1 focus:ring-0 focus:ring-offset-0 focus:outline-none"
              />
            )
          })}
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className={`w-full ${isIOS ? 'overflow-hidden' : 'max-h-[62vh]'} flex flex-col gap-4`}>
        <div className={`rounded-md border flex flex-2/3 flex-col ${isIOS ? 'h-[70vh]' : 'h-[400px]'} overflow-auto`}>
          <Table className={`${isIOS ? 'w-max' : 'w-full'}`}>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </div>
      </div>


      {/* Mobile-Friendly Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page selector */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap hidden xs:block">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            // onValueChange={(value) => {
            //   table.setPageSize(Number(value))
            // }}
            onValueChange={(value) => manualPagination ? handlePageSizeChange(Number(value)) : table.setPageSize(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px] xs:w-[80px] focus:ring-0 focus:ring-offset-0 focus:outline-none">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="focus:outline-none">
              {[5, 10, 20, 50].map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                  className="focus:bg-accent focus:text-accent-foreground focus:ring-0"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Pagination controls */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Page info */}
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            {/* Navigation buttons */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(0)}
                disabled={!canPreviousPage || isLoading}
                // disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0 hidden xs:inline-flex"
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => manualPagination ? handlePageChange(internalPageIndex - 1) : table.previousPage()}
                // disabled={!table.getCanPreviousPage()}
                disabled={!canPreviousPage || isLoading}
                className="h-8 w-8 p-0"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => manualPagination ? handlePageChange(internalPageIndex + 1) : table.nextPage()}
                disabled={!canNextPage || isLoading}
                // disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => manualPagination ? handlePageChange(pageCount - 1) : table.setPageIndex(table.getPageCount() - 1)}
                // disabled={!table.getCanNextPage()}
                disabled={!canNextPage || isLoading}
                className="h-8 w-8 p-0 hidden xs:inline-flex"
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




