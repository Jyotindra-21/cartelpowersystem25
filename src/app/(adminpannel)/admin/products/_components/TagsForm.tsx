// _components/TagsForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IProduct, IProductTags, ProductTagsSchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { updateProductSection } from "@/services/product.services";
import { Loader, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface TagsFormProps {
    initialData?: IProductTags;
    onSuccess: () => void;
    isLoading: boolean;
    productId: string;
}

export function TagsForm({
    initialData,
    onSuccess,
    isLoading,
    productId,
}: TagsFormProps) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof ProductTagsSchema>>({
        resolver: zodResolver(ProductTagsSchema),
        defaultValues: initialData || {
            tags: [],
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);


    async function onSubmit(values: IProductTags) {
        try {
            setIsSubmitting(true)
            const response = await updateProductSection<Partial<IProduct>>(
                productId,
                "tags",
                values
            );

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Tags updated successfully",
                });
                onSuccess();
            } else {
                throw new Error(response.error || "Failed to update tags");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An error occurred",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReset = () => {
        form.reset();
        setShowResetDialog(false);
        toast({
            title: "Form reset",
            description: "All changes have been discarded",
        });
    };
    if (isLoading) {
        return (
            <div className="space-y-6 p-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem id="form-field-tags">
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <div className="space-y-3">
                                        {(field.value || []).map((tag, index) => (
                                            <div key={index} id={`form-field-tags[${index}]`} className="space-y-3 rounded-lg border p-2 bg-slate-50 border-gray-100">
                                                <div key={index} className="flex flex-row gap-2">
                                                    <Input
                                                        id={`form-field-tags[${index}]`}
                                                        value={tag}
                                                        onChange={(e) => {
                                                            const newTags = [...(field.value || [])];
                                                            newTags[index] = e.target.value;
                                                            field.onChange(newTags);
                                                        }}
                                                        placeholder={`Tag ${index + 1}`}
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-auto"
                                                        onClick={() => {
                                                            field.onChange(
                                                                (field.value || []).filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                    >
                                                        <Trash className="h-4 w-4 sm:mr-2" />
                                                        <span className="sr-only sm:not-sr-only">Remove</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={() => {
                                                field.onChange([...(field.value || []), ""]);
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Tag
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setShowResetDialog(true)}
                        >
                            Reset
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                            {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>

                    <ConfirmationDialog
                        isOpen={showResetDialog}
                        onOpenChange={setShowResetDialog}
                        title="Are you sure?"
                        description="This will reset all changes you've made to the form. This action cannot be undone."
                        onConfirm={handleReset}
                        confirmText="Reset"
                    />
                </form>
            </Form>
        </div>
    );
}