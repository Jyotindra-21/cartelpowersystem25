'use client'

import { ColumnDef, Table } from '@tanstack/react-table'
import { Activity, MoreVertical, Trash2, X } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DeleteDialog } from './delete-dialog'
import { IVisitorList } from '@/types/commonTypes'
import Link from 'next/link'


interface BulkActionsHeaderProps<TData extends IVisitorList> {
  table: Table<TData>;
  onSuccess?: () => void
}
export function BulkActionsHeader<TData extends IVisitorList>({
  table,
  onSuccess
}: BulkActionsHeaderProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows
  const selectedIds = selectedRows.map(row => row.original._id!).filter(Boolean)

  const handleDeselectAll = () => {
    table.resetRowSelection()
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeselectAll}
            className="h-8"
          >
            Cancel
            <X />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="primary"
            size="sm"
            disabled={selectedRows.length === 0}
            className="h-8"
          >
            Actions
            <MoreVertical className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            document.getElementById('delete-dialog-trigger')?.click();
          }}>
            <>
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              Delete
              <DeleteDialog ids={selectedIds} onSuccess={onSuccess} isBulk={true} table={table}>
                <button id="delete-dialog-trigger" className="hidden" />
              </DeleteDialog>
            </>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </div>
        </div>
      )}
    </div>
  )
}

const ActionsCell = ({ row, onSuccess }: { row: { original: IVisitorList }, onSuccess?: () => void }) => {
  const visitor = row.original
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/visitor/${visitor._id}`}>
            <Activity className="ml-2 h-4 w-4 text-emerald-500" />
            Activity
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          document.getElementById('delete-dialog-trigger')?.click();
        }}>
          <>
            <Trash2 className="ml-2 h-4 w-4 text-red-500" />
            Delete
            <DeleteDialog ids={[visitor._id]} onSuccess={onSuccess}>
              <button id="delete-dialog-trigger" className="hidden" />
            </DeleteDialog>
          </>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const getVisitorColumns = (onSuccess?: () => void): ColumnDef<IVisitorList>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'visitorId',
    header: 'Visitor ID',
    cell: ({ row }) => {
      const id = row.getValue('visitorId') as string
      return <span className="font-mono">{id.slice(0, 8)}...</span>
    }
  },
  {
    accessorKey: 'device',
    header: 'Device',
    cell: ({ row }) => {
      const device = row.getValue('device') as string
      return <span>{device}</span>
    }
  },
  {
    accessorKey: 'deviceType',
    header: 'Device Type',
    cell: ({ row }) => {
      const type = row.getValue('deviceType') as string
      return <Badge variant="outline">{type}</Badge>
    }
  },
  {
    accessorKey: 'isBot',
    header: 'Is Bot',
    cell: ({ row }) => {
      const isBot = row.getValue('isBot') as boolean
      return isBot ? '🤖 Bot' : '👤 Human'
    }
  },
  {
    accessorKey: 'sessionDuration',
    header: 'Session Duration',
  },
  {
    accessorKey: 'pagesLength',
    header: 'Pages Visited',
  },
  {
    accessorKey: 'visitCount',
    header: 'Total Visits',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell row={row} onSuccess={onSuccess} />,
  },
]