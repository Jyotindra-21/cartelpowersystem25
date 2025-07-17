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
import { IProduct, IProductMedia, ProductMediaSchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { updateProductSection } from "@/services/product.services";
import ImageUpload from "@/components/custom/ImageUpload";
import { useState } from "react";
import { ImagePlus, Loader, Trash } from "lucide-react";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaFormProps {
    initialData?: IProductMedia;
    onSuccess: () => void;
    isLoading: boolean;
    productId: string;
}

export function MediaForm({
    initialData,
    onSuccess,
    isLoading,
    productId,
}: MediaFormProps) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof ProductMediaSchema>>({
        resolver: zodResolver(ProductMediaSchema),
        defaultValues: initialData || {
            mainImage: "",
            images: [],
            videoUrl: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IProductMedia) {
        try {
            setIsSubmitting(true)
            const response = await updateProductSection<Partial<IProduct>>(
                productId,
                "media",
                values
            );

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Media updated successfully",
                });
                onSuccess();
            } else {
                throw new Error(response.error || "Failed to update media");
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
                        name="mainImage"
                        render={({ field }) => (
                            <FormItem id="form-field-mainImage" className="mb-6">
                                <FormLabel>Main Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        name="mainImage"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-6  p-2 rounded-lg border border-gray-100">

                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem id="form-field-images" >
                                    <FormLabel>Additional Images</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {field.value?.map((image, index) => (
                                                <div key={index} className="space-y-3  bg-slate-50 p-3 rounded-lg border  border-gray-200 " id={`form-field-images[${index}].url`}>
                                                    {/* Image Upload */}
                                                    <div className="w-full">
                                                        <ImageUpload
                                                            name={`additional-${index}`}
                                                            value={image.url}
                                                            onChange={(url: string) => {
                                                                const newImages = [...field.value];
                                                                newImages[index] = { ...newImages[index], url };
                                                                field.onChange(newImages);
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Alt Text and Delete Button */}
                                                    <div className="flex gap-2 w-full">
                                                        <Input
                                                            placeholder="Alt text"
                                                            value={image.altText || ""}
                                                            onChange={(e) => {
                                                                const newImages = [...field.value];
                                                                newImages[index] = {
                                                                    ...newImages[index],
                                                                    altText: e.target.value
                                                                };
                                                                field.onChange(newImages);
                                                            }}
                                                            className="flex-1"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                field.onChange(
                                                                    field.value.filter((_, i) => i !== index)
                                                                );
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Image Button */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => {
                                                    field.onChange([...field.value, { url: "" }]);
                                                }}
                                            >
                                                <ImagePlus className="h-4 w-4 mr-2" />
                                                Add Image
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://youtube.com/embed/..."
                                        {...field}
                                        disabled={isLoading}
                                    />
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