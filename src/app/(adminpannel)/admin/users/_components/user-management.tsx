'use client'

import { UserDialog } from './user-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { User } from './types'
import { useSession } from 'next-auth/react'
import { getColumns } from './columns'
import { DataTable } from '@/components/custom/data-table'

interface UserManagementProps {
    users: User[]
}
export function UserManagement({ users }: UserManagementProps) {
    const columns = getColumns()
    const { data: session } = useSession()
    const currentUser = session?.user as User | undefined

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-2xl font-bold tracking-tight">User Management</h2>
                {currentUser?.role === "admin" && (
                    <UserDialog>
                        <Button>
                            <Plus className=" h-4 w-4" />
                            Add
                        </Button>
                    </UserDialog>
                )}
            </div>
            <DataTable columns={columns} data={users} />
        </div>
    )
}