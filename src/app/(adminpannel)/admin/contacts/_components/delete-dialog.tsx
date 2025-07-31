'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/hooks/use-toast'
import { deleteContact } from '@/services/contact.services'
import { Table } from '@tanstack/react-table'
import { IContactForm } from '@/schemas/contactSchema'

interface DeleteDialogProps<TData extends IContactForm> {
  ids: string[] // Changed from id to ids array
  children: React.ReactNode
  onSuccess?: () => void
  isBulk?: boolean // Flag to indicate bulk operation
  table?: Table<TData>
}

export function DeleteDialog<TData extends IContactForm>({ ids, children, onSuccess, isBulk = false, table }: DeleteDialogProps<TData>) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsDeleting(true)
    try {
      // Handle both single and bulk deletes
      const { data } = await deleteContact(ids)
      if (!data?.deletedCount) {
        throw new Error(`${data?.deletedCount} deletions failed`)
      }
      toast({
        title: 'Success',
        description: isBulk
          ? `${ids.length} contacts deleted successfully`
          : 'Contact deleted successfully',
      })

      if (onSuccess) onSuccess()
      if (table) {
        table.resetRowSelection()
      }
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error(`ERROR: ${error}`)
      toast({
        title: 'Error',
        description: isBulk
          ? 'Failed to delete some contacts. Please try again.'
          : 'Failed to delete contact. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isBulk ? `Delete ${ids.length} Contacts` : 'Delete Contact'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            {isBulk
              ? `Are you sure you want to delete ${ids.length} selected contacts? This action cannot be undone.`
              : 'Are you sure you want to delete this contact? This action cannot be undone.'}
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}