'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { IContactForm } from '@/schemas/contactSchema'
import { updateContactStatus } from '@/services/contact.services'

type ContactStatus = 'new' | 'inprogress' | 'resolved'

export function ContactDialog({
    contact,
    children,
}: {
    contact: IContactForm
    children: React.ReactNode
}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<ContactStatus>(contact.status || 'new')
    const [isLoading, setIsLoading] = useState(false)

    const handleStatusChange = async () => {
        setIsLoading(true)
        try {
            const response = await updateContactStatus(contact._id!, status)

            if (!response.success) {
                throw new Error(response.error || 'Failed to update status')
            }

            toast({
                title: 'Success',
                description: `Status updated to ${status}`,
            })

            router.refresh()
            setOpen(false)
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update status',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusBadge = (status: ContactStatus) => {
        const variants = {
            new: 'bg-blue-100 text-blue-800',
            inprogress: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${variants[status]}`}>{status}</span>
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Contact Status</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Read-only contact info */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <div className="p-2 border rounded bg-gray-50">
                            {contact.firstName} {contact.lastName}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="p-2 border rounded bg-gray-50">
                            {contact.email}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <div className="p-2 border rounded bg-gray-50">
                            {contact.phone}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Current Status</Label>
                        <div className="p-2">
                            {getStatusBadge(contact.status || 'new')}
                        </div>
                    </div>

                    {/* Status selector */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Update Status</Label>
                        <Select
                            value={status}
                            onValueChange={(value: string) => setStatus(value as ContactStatus)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        New
                                    </div>
                                </SelectItem>
                                <SelectItem value="inprogress">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                        In Progress
                                    </div>
                                </SelectItem>
                                <SelectItem value="resolved">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Resolved
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStatusChange}
                            disabled={isLoading || status === contact.status}
                        >
                            {isLoading ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}