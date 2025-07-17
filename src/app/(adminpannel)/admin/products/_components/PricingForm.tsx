"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { IProduct, IProductPricing, ProductPricingSchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { updateProductSection } from "@/services/product.services";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { Loader } from "lucide-react";

interface PricingFormProps {
    initialData?: IProductPricing;
    onSuccess: () => void;
    isLoading: boolean;
    productId: string;
}

export function PricingForm({
    initialData,
    onSuccess,
    isLoading,
    productId,
}: PricingFormProps) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof ProductPricingSchema>>({
        resolver: zodResolver(ProductPricingSchema),
        defaultValues: initialData || {
            price: 0,
            oldPrice: 0,
            taxIncluded: false,
            costPrice: 0,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IProductPricing) {
        try {
            setIsSubmitting(true)
            const response = await updateProductSection<Partial<IProduct>>(
                productId,
                "pricing",
                values
            );

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Pricing updated successfully",
                });
                onSuccess();
            } else {
                throw new Error(response.error || "Failed to update pricing");
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
                        name="price"
                        render={({ field }) => (
                            <FormItem id="form-field-price">
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="oldPrice"
                        render={({ field }) => (
                            <FormItem id="form-field-oldPrice">
                                <FormLabel>Original Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value ? parseFloat(e.target.value) : null
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                            <FormItem id="form-field-costPrice">
                                <FormLabel>Cost Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="taxIncluded"
                        render={({ field }) => (
                            <FormItem id="form-field-taxIncluded" className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Tax Included</FormLabel>
                                    <FormDescription>
                                        Is tax included in the price?
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
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