'use client'

import { TestimonialDialog } from './testimonial-dialog'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { getColumns } from './columns'
import { DataTable } from '@/components/custom/data-table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { ITestimonial } from '@/schemas/testimonialSchema'

interface TestimonialManagementProps {
    initialTestimonials: ITestimonial[]
}

export function TestimonialManagement({ initialTestimonials = [] }: TestimonialManagementProps) {
    const router = useRouter()
    const columns = getColumns()
    const [activeTab, setActiveTab] = useState<'all' | 'published' | 'hidden'>('all')
    const [isRefreshing, setIsRefreshing] = useState(false)
    
    // Filter testimonials based on active tab
    const filteredTestimonials = initialTestimonials.filter(testimonial => {
        if (activeTab === 'all') return true
        if (activeTab === 'published') return testimonial.status
        if (activeTab === 'hidden') return !testimonial.status
        return true
    })

    const handleTabChange = (value: string) => {
        if (value === "all" || value === "published" || value === "hidden") {
            setActiveTab(value)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        router.refresh()
        setTimeout(() => setIsRefreshing(false), 500)
    }

    const testimonialCounts = {
        all: initialTestimonials.length,
        published: initialTestimonials.filter(t => t.status).length,
        hidden: initialTestimonials.filter(t => !t.status).length,
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg md:text-2xl font-bold tracking-tight">Testimonial Management</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage all testimonials and their visibility
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
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <TestimonialDialog>
                                <Button className="gap-1">
                                    <Plus className="h-4 w-4" />
                                    <span>Add</span>
                                </Button>
                            </TestimonialDialog>
                        </TooltipTrigger>
                        <TooltipContent>Add New Testimonial</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <TabsList className="relative p-0 h-auto rounded-lg flex">
                        {[
                            { value: 'all', label: 'All', count: testimonialCounts.all },
                            { value: 'published', label: 'Published', count: testimonialCounts.published },
                            { value: 'hidden', label: 'Hidden', count: testimonialCounts.hidden },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`px-3 py-1 text-xs rounded-lg cursor-pointer transition-colors capitalize ${activeTab === tab.value
                                    ? "!bg-blue-100 text-blue-600"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {tab.label}
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
                        <DataTable columns={columns} data={filteredTestimonials} />
                    )}
                </motion.div>
            </Tabs>
        </div>
    )
}