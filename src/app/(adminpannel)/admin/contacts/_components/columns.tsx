'use client'

import { ColumnDef, Table } from '@tanstack/react-table'
import { Edit, Mail, MoreVertical, Trash2, X } from 'lucide-react'
import { toast } from '@/components/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { IContactForm } from '@/schemas/contactSchema'
import { ContactDialog } from './contact-dialog'
import { updateContactStatus } from '@/services/contact.services'
import { Checkbox } from '@/components/ui/checkbox'
import { DeleteDialog } from './delete-dialog'

interface BulkActionsHeaderProps<TData extends IContactForm> {
  table: Table<TData>;
  onSuccess?: () => void
}
export function BulkActionsHeader<TData extends IContactForm>({
  table,
  onSuccess
}: BulkActionsHeaderProps<TData>) {
  const router = useRouter()
  const selectedRows = table.getSelectedRowModel().rows
  const selectedIds = selectedRows.map(row => row.original._id!).filter(Boolean)

  const handleBulkAction = async (action: string) => {
    try {
      const contactIds = selectedRows.map(row => row.original._id)
      if (action === 'email') {
        // Assuming your row data has an 'email' property
        const emails = selectedRows.map(row => row.original.email).filter(Boolean)
        if (emails.length > 0) {
          window.location.href = `mailto:${emails.join(',')}`
          return
        } else {
          toast({
            title: 'No emails',
            description: 'No valid email addresses found for selected contacts',
            variant: 'destructive',
          })
          return
        }

      }
      toast({
        title: 'Action',
        description: `${action} performed on ${contactIds.length} contacts`,
      })

      if (onSuccess) onSuccess()
      table.resetRowSelection()
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to perform bulk action: ${error}`,
        variant: 'destructive',
      })
    }
  }

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
            {/* <Tags className="mr-2 h-4 w-4" /> */}
            Actions
            <MoreVertical className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem onClick={() => handleBulkAction('email')}>
            <Mail className="mr-2 h-4 w-4 text-blue-600" />
            Send Email
          </DropdownMenuItem>

          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            document.getElementById('delete-dialog-trigger')?.click();
          }}>
            <>
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              Delete
              <DeleteDialog ids={selectedIds} onSuccess={onSuccess} isBulk={true} >
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


const StatusCell = ({ row, onSuccess }: { row: { original: IContactForm }, onSuccess?: () => void }) => {
  const router = useRouter()
  const contact = row.original

  const handleStatusChange = async (newStatus: 'new' | 'inprogress' | 'resolved') => {
    try {
      const response = await updateContactStatus(contact._id!, newStatus);
      if (!response.success) {
        throw new Error('Failed to update contact status')
      }
      toast({
        title: 'Success',
        description: `Contact status updated to ${newStatus}`,
      })

      if (onSuccess) onSuccess()
      router.refresh()

    } catch (error) {
      console.error(`Error updating status: ${error}`)
      toast({
        title: 'Error',
        description: 'Failed to update contact status',
        variant: 'destructive',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="capitalize">
          {contact.status}
          <MoreVertical className="ml-2 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange('new')}>
          <Badge variant="destructive" className="mr-2">New</Badge>
          {contact.status === 'new' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('inprogress')}>
          <Badge variant="warning" className="mr-2">In Progress</Badge>
          {contact.status === 'inprogress' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('resolved')}>
          <Badge variant="success" className="mr-2">Resolved</Badge>
          {contact.status === 'resolved' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ActionsCell = ({ row, onSuccess }: { row: { original: IContactForm }, onSuccess?: () => void }) => {
  const contact = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Edit Contact */}
        <ContactDialog contact={contact}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center px-2 py-1 cursor-pointer w-full">
              <Edit className="mr-2 h-4 w-4 text-blue-600" />
              Edit
            </div>
          </DropdownMenuItem>
        </ContactDialog>

        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          document.getElementById('delete-dialog-trigger')?.click();
        }}>
          <>
            <Trash2 className="ml-2 h-4 w-4 text-red-500" />
            Delete
            <DeleteDialog ids={[contact._id!]} onSuccess={onSuccess}>
              <button id="delete-dialog-trigger" className="hidden" />
            </DeleteDialog>
          </>

        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const getContactColumns = (onSuccess?: () => void): ColumnDef<IContactForm>[] => [
  // Add selection column first
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
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusCell onSuccess={onSuccess} row={row} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell row={row} onSuccess={onSuccess} />,
  },

]
