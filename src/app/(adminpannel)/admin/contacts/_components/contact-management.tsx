'use client'
import { BulkActionsHeader, getContactColumns } from './columns'
import { DataTable } from '@/components/custom/data-table'
import { IContactForm } from '@/schemas/contactSchema'
import { getContacts } from '@/services/contact.services'
import { Pagination } from '@/types/ApiResponse'
import { useState } from 'react'
interface ContactManagementProps {
    contact: IContactForm[]
    paginationData: Pagination
}
export function ContactManagement({ contact, paginationData }: ContactManagementProps) {
    const [contacts, setContacts] = useState<IContactForm[]>(contact)
    const [pagination, setPagination] = useState<Pagination | undefined>(paginationData)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async (page: number, limit: number) => {
        setIsLoading(true)
        try {
            const result = await getContacts({ page, limit })
            setContacts(result?.data || [])
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
                <h2 className="text-lg md:text-2xl font-bold tracking-tight">Contact Management</h2>
            </div>

            <DataTable<IContactForm, unknown>
                columns={getContactColumns(handleSuccess)}
                data={contacts}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                isLoading={isLoading}
                manualPagination={true}
                bulkAction={true}
                bulkActionsHeader={({ table }) => <BulkActionsHeader table={table} onSuccess={handleSuccess} />} />
        </div>
    )
}