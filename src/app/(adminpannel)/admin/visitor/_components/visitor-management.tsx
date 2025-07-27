'use client'
import { BulkActionsHeader, getVisitorColumns, } from './columns'
import { DataTable } from '@/components/custom/data-table'
import { getVisitors } from '@/services/visitor.services'
import { Pagination } from '@/types/ApiResponse'
import { IVisitorList } from '@/types/commonTypes'
import { useState } from 'react'
interface VisitorManagementProps {
    visitor: IVisitorList[]
    paginationData: Pagination
}
export function VisitorManagement({ visitor, paginationData }: VisitorManagementProps) {
    const [visitors, setVisitors] = useState<IVisitorList[]>(visitor)
    const [pagination, setPagination] = useState<Pagination | undefined>(paginationData)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async (page: number, limit: number) => {
        setIsLoading(true)
        try {
            const result = await getVisitors({ page, limit })
            setVisitors(result?.data || [])
            setPagination(result?.pagination)

        } catch (error) {
            console.error('Failed to fetch contacts:', error)
        } finally {
            setIsLoading(false)
        }
    }
    const handlePaginationChange = (newPage: number, newLimit: number) => {
        fetchData(newPage, newLimit)
    }

    const handleSuccess = () => {
        fetchData(paginationData?.page, paginationData?.limit) // Refetch contacts after deletion
    }
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-2xl font-bold tracking-tight">Visitor Management</h2>
            </div>

            <DataTable<IVisitorList, unknown>
                columns={getVisitorColumns(handleSuccess)}
                data={visitors}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                isLoading={isLoading}
                manualPagination={true}
                bulkAction={true}
                bulkActionsHeader={({ table }) => <BulkActionsHeader table={table} onSuccess={handleSuccess} />} />
        </div>
    )
}