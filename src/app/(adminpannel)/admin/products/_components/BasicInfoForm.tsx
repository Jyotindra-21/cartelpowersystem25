// _components/BasicInfoForm.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { IProduct, IProductBasicInfo, ProductBasicInfoSchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { createProduct, updateProductSection } from "@/services/product.services";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";

interface BasicInfoFormProps {
    initialData?: IProductBasicInfo;
    onSuccess: () => void;
    onSlugChange: (props: string) => void
    isLoading: boolean;
    isNewProduct?: boolean;
    productId?: string;
}

export function BasicInfoForm({
    initialData,
    onSuccess,
    onSlugChange,
    isLoading,
    isNewProduct = false,
    productId = "",
}: BasicInfoFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof ProductBasicInfoSchema>>({
        resolver: zodResolver(ProductBasicInfoSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            shortDescription: "",
            brand: "",
            slug: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    useEffect(() => {
        if (!isLoading && initialData) {
            form.reset(initialData);
        }
    }, [initialData, isLoading, form]);

    async function onSubmit(values: IProductBasicInfo) {
        try {
            setIsSubmitting(true);
            if (isNewProduct) {
                // Create a new product with minimal required data
                const newProductData: Partial<IProduct> = { basicInfo: values }
                const response = await createProduct(newProductData);

                if (response.success && response.data) {
                    toast({
                        title: "Success",
                        description: "Product created successfully",
                    });
                    // Redirect to edit page for the new product
                    router.push(`/admin/products/${response.data.basicInfo.slug}`);
                } else {
                    throw new Error(response.error || "Failed to create product");
                }
            } else {
                // Update existing product

                const response = await updateProductSection<Partial<IProduct>>(
                    productId,
                    "basicInfo",
                    values
                );

                if (response.success && response.data) {
                    toast({
                        title: "Success",
                        description: "Basic info updated successfully",
                    });
                    if (productId !== response.data.basicInfo?.slug) {
                        onSlugChange(response.data.basicInfo?.slug || "");
                    }
                    onSuccess();
                } else {
                    throw new Error(response.error || "Failed to update basic info");
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An error occurred",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter product name"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug (URL) *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="product-slug"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter brand name"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Brief description (shown in product cards)"
                                        {...field}
                                        disabled={isLoading}
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
                                <FormLabel>Full Description *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Detailed product description"
                                        {...field}
                                        disabled={isLoading}
                                        className="min-h-[200px]"
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
                            {initialData ? "Update" : "Create"}
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