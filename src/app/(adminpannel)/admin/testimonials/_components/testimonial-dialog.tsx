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
import { ITestimonial, testimonialSchema } from '@/schemas/testimonialSchema'
import ImageUploadCommon from "@/components/custom/ImageUploadCommon";
import { createTestimonial, updateTestimonial } from '@/services/testimonialService'

type TestimonialFormValues = z.infer<typeof testimonialSchema>

interface TestimonialDialogProps {
    testimonial?: ITestimonial
    children: React.ReactNode
}

export function TestimonialDialog({ testimonial, children }: TestimonialDialogProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const defaultValues: Partial<TestimonialFormValues> = {
        fullName: testimonial?.fullName || '',
        designation: testimonial?.designation || '',
        image: testimonial?.image || '',
        description: testimonial?.description || '',
        status: testimonial?.status || true,
    }

    const form = useForm<TestimonialFormValues>({
        resolver: zodResolver(testimonialSchema),
        defaultValues
    })

    // Reset form when testimonial changes
    useEffect(() => {
        if (open) {
            form.reset({
                fullName: testimonial?.fullName || '',
                designation: testimonial?.designation || '',
                image: testimonial?.image || '',
                description: testimonial?.description || '',
                status: testimonial?.status || true,
            })
        }
    }, [testimonial, open, form])

    async function onSubmit(data: TestimonialFormValues) {
        try {
            let response;
            if (testimonial) {
                // Update existing testimonial using service
                response = await updateTestimonial(testimonial._id!, data);
            } else {
                // Create new testimonial using service
                response = await createTestimonial(data);
            }
            console.log("response", response);
            if (!response.success) {
                throw new Error(response.error || 'Failed to save testimonial');
            }
            toast({
                title: 'Success',
                description: testimonial ? 'Testimonial updated successfully' : 'Testimonial created successfully',
            });

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(`ERROR: ${error}`);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to save testimonial. Please try again.',
                variant: 'destructive',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} key={testimonial?._id || 'create'}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                        <ImageUploadCommon
                                            value={field.value}
                                            onChange={field.onChange}
                                            uploadService="minio"
                                            folder="testimonials"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Testimonial</FormLabel>
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