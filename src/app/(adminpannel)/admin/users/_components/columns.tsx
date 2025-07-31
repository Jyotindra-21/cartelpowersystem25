'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'

import { UserDialog } from './user-dialog'
import { DeleteDialog } from './delete-dialog'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/hooks/use-toast'
import { Label } from '@radix-ui/react-label'
import { User } from './types'
import { useSession } from 'next-auth/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const ActionsCell = ({ row }: { row: { original: User } }) => {
  const user = row.original;
  const { data: session } = useSession();
  const currentUser = session?.user as User | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Edit User */}
        <UserDialog user={user}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center px-2 py-1 cursor-pointer w-full">
              <Edit className="mr-2 h-4 w-4 text-blue-600" />
              Edit
            </div>
          </DropdownMenuItem>
        </UserDialog>

        {/* Delete User */}
        {currentUser?.role === "admin" && (
          <DeleteDialog id={user._id}>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <div className="flex items-center px-2 py-1 cursor-pointer w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </div>
            </DropdownMenuItem>
          </DeleteDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const IsAdminCell = ({ row }: { row: { original: User } }) => {
  const router = useRouter()
  const user = row.original
  const { data: session } = useSession()
  const currentUser = session?.user as User | undefined
  const handleAdminToggle = async (isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin })
      })

      if (!response.ok) {
        throw new Error('Failed to update admin status')
      }

      toast({
        title: 'Success',
        description: `User ${isAdmin ? 'promoted to admin' : 'demoted from admin'}`,
      })

      router.refresh()
    } catch (error) {
      console.error(`ERROR : ${error}`)
      toast({
        title: 'Error',
        description: 'Failed to update admin status',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={user.isAdmin}
        disabled={currentUser?.role !== "admin"}
        onCheckedChange={handleAdminToggle}
        id={`admin-switch-${user._id}`}
      />
      <Label htmlFor={`admin-switch-${user._id}`}>
        {user.isAdmin ? 'Admin' : 'User'}
      </Label>
    </div>
  )
}




export const getColumns = (): ColumnDef<User>[] => {

  return [
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role')
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
            {String(role)}
          </span>
        )
      },
    },
    {
      accessorKey: 'isAdmin',
      header: 'Admin Status',
      cell: ({ row }) => <IsAdminCell row={row} />
    },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => {
        const isVerified = row.getValue('isVerified')
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
            {isVerified ? 'Verified' : 'Pending'}
          </span>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      },
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ]
}