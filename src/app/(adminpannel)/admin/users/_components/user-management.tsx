'use client'

import { UserDialog } from './user-dialog'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getColumns } from './columns'
import { DataTable } from '@/components/custom/data-table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { User } from './types'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'

interface UserManagementProps {
    initialUsers: User[]
}

export function UserManagement({ initialUsers = [] }: UserManagementProps) {
    const router = useRouter()
    const columns = getColumns()
    const { data: session } = useSession()
    const currentUser = session?.user as User | undefined
    const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'user'>('all')
    const [isRefreshing, setIsRefreshing] = useState(false)
    // Filter users based on active tab and search term
    const filteredUsers = initialUsers.filter(user => {
        // Tab filter
        const roleMatch = activeTab === 'all' || user.role === activeTab
        return roleMatch
    })

    const handleTabChange = (value: string) => {
        if (value === "all" || value === "admin" || value === "user") {
            setActiveTab(value)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        router.refresh() // This will re-fetch the server component
        setTimeout(() => setIsRefreshing(false), 500) // Small delay for better UX
    }

    const userCounts = {
        all: initialUsers.length,
        admin: initialUsers.filter(u => u.role === 'admin').length,
        user: initialUsers.filter(u => u.role === 'user').length,
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg md:text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage all registered users and their permissions
                    </p>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Refresh data</TooltipContent>
                    </Tooltip>
                    {currentUser?.role === "admin" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <UserDialog>
                                    <Button className="gap-1">
                                        <Plus className="h-4 w-4" />
                                        <span>Add User</span>
                                    </Button>
                                </UserDialog>
                            </TooltipTrigger>
                            <TooltipContent>Add New</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Enhanced tabs with proper background color change */}
                    <TabsList className="relative p-0 h-auto rounded-lg flex">
                        {[
                            { value: 'all', label: 'All', count: userCounts.all },
                            { value: 'admin', label: 'Admins', count: userCounts.admin },
                            { value: 'user', label: 'Users', count: userCounts.user },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`px-3 py-1 text-xs rounded-lg cursor-pointer transition-colors capitalize ${activeTab === tab.value
                                    ? "!bg-blue-100 text-blue-600"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {tab.value}
                                <Badge
                                    variant={"secondary"}
                                    className={`px-1.5 py-0 text-xs ${activeTab === tab.value ? '' : 'bg-primary/10 text-primary'
                                        }`}
                                >
                                    {tab.count}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                {/* Content area */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border bg-card p-2 shadow-sm"
                >
                    {isRefreshing ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <DataTable columns={columns} data={filteredUsers} />
                    )}
                </motion.div>
            </Tabs>
        </div>
    )
}