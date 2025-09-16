'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ITeamMember, teamMemberSchema } from '@/schemas/teamMemberSchema'
import ImageUpload from "@/components/custom/ImageUpload";
import { createTeamMember, updateTeamMember } from '@/services/teamMemberService'

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>

interface TeamMemberDialogProps {
    teamMember?: ITeamMember
    children: React.ReactNode
}

export function TeamMemberDialog({ teamMember, children }: TeamMemberDialogProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const defaultValues: Partial<TeamMemberFormValues> = {
        fullName: teamMember?.fullName || '',
        designation: teamMember?.designation || '',
        image: teamMember?.image || '',
        description: teamMember?.description || '',
        expertise: teamMember?.expertise || '',
        status: teamMember?.status || true,
    }

    const form = useForm<TeamMemberFormValues>({
        resolver: zodResolver(teamMemberSchema),
        defaultValues
    })

    // Reset form when teamMember changes
    useEffect(() => {
        if (open) {
            form.reset({
                fullName: teamMember?.fullName || '',
                designation: teamMember?.designation || '',
                image: teamMember?.image || '',
                description: teamMember?.description || '',
                expertise: teamMember?.expertise || '',
                status: teamMember?.status || true,
            })
        }
    }, [teamMember, open, form])

    async function onSubmit(data: TeamMemberFormValues) {
        try {
            let response;
            if (teamMember) {
                // Update existing teamMember using service
                response = await updateTeamMember(teamMember._id!, data);
            } else {
                // Create new teamMember using service
                response = await createTeamMember(data);
            }
            console.log("response", response);
            if (!response.success) {
                throw new Error(response.error || 'Failed to save Team Member');
            }
            toast({
                title: 'Success',
                description: teamMember ? 'Team Member updated successfully' : 'Team Member created successfully',
            });

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(`ERROR: ${error}`);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to save Team Member. Please try again.',
                variant: 'destructive',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} key={teamMember?._id || 'create'}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{teamMember ? 'Edit TeamMember' : 'Add TeamMember'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col flex-1 min-h-0">
                        <div className='flex-1 overflow-hidden hover:overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 transition-all space-y-4'>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="designation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Designation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CEO, Company Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Share your experience (50-150 characters)"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expertise"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expertise</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Share your expertise, separated by commas"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            id="status-toggle"
                                        />
                                    </FormControl>
                                    <Label htmlFor="status-toggle">Published</Label>
                                </FormItem>
                            )}
                        />
                         </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}