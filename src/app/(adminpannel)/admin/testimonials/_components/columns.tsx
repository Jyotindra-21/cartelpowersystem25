'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreVertical, Trash2, Eye, EyeOff } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/hooks/use-toast'
import { Label } from '@radix-ui/react-label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ITestimonial } from '@/schemas/testimonialSchema'
import { DeleteDialog } from './delete-dialog'
import { TestimonialDialog } from './testimonial-dialog'

const ActionsCell = ({ row }: { row: { original: ITestimonial } }) => {
  const testimonial = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Edit Testimonial */}
        <TestimonialDialog testimonial={testimonial}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center px-2 py-1 cursor-pointer w-full">
              <Edit className="mr-2 h-4 w-4 text-blue-600" />
              Edit
            </div>
          </DropdownMenuItem>
        </TestimonialDialog>

        {/* Delete Testimonial */}
        <DeleteDialog id={testimonial._id!}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusCell = ({ row }: { row: { original: ITestimonial } }) => {
  const router = useRouter()
  const testimonial = row.original
  
  const handleStatusToggle = async (status: boolean) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update testimonial status')
      }

      toast({
        title: 'Success',
        description: `Testimonial ${status ? 'published' : 'hidden'}`,
      })

      router.refresh()
    } catch (error) {
      console.error(`ERROR : ${error}`)
      toast({
        title: 'Error',
        description: 'Failed to update testimonial status',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={testimonial.status}
        onCheckedChange={handleStatusToggle}
        id={`status-switch-${testimonial._id}`}
      />
      <Label htmlFor={`status-switch-${testimonial._id}`}>
        {testimonial.status ? 
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1 text-green-600" /> Visible
          </div> : 
          <div className="flex items-center">
            <EyeOff className="h-4 w-4 mr-1 text-gray-500" /> Hidden
          </div>
        }
      </Label>
    </div>
  )
}

export const getColumns = (): ColumnDef<ITestimonial>[] => {
  return [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const imageUrl = row.getValue('image') as string
        return (
          <div className="w-12 h-12 relative rounded-full overflow-hidden">
            <img
              src={imageUrl}
              height={200}
              width={200}
              alt={row.original.fullName}
            //   fill
              className="object-cover"
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
    },
    {
      accessorKey: 'description',
      header: 'Testimonial',
      cell: ({ row }) => {
        const description = row.getValue('description') as string
        return (
          <div className="max-w-xs truncate">
            {description}
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusCell row={row} />
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