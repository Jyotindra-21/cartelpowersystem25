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
import { IProduct, IProductFeatures, ProductFeaturesSchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { updateProductSection } from "@/services/product.services";
import { Loader, Plus, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";

interface FeaturesFormProps {
    initialData?: IProductFeatures;
    onSuccess: () => void;
    isLoading: boolean;
    productId: string;
}

export function FeaturesForm({
    initialData,
    onSuccess,
    isLoading,
    productId,
}: FeaturesFormProps) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof ProductFeaturesSchema>>({
        resolver: zodResolver(ProductFeaturesSchema),
        defaultValues: initialData || {
            features: [],
            keyFeatures: [],
            specifications: [],
            benefits: [],
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IProductFeatures) {
        setIsSubmitting(true)
        try {
            const response = await updateProductSection<Partial<IProduct>>(
                productId,
                "featuresSection",
                values
            );

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Features updated successfully",
                });
                onSuccess();
            } else {
                throw new Error(response.error || "Failed to update features");
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
                    {/* Key Features */}
                    <div className="space-y-6  p-2 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-medium">Specifications</h3>

                        <FormField
                            control={form.control}
                            name="specifications"
                            render={({ field }) => (
                                <FormItem id="form-field-specifications">
                                    <FormLabel>Specifications</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            {(field.value || []).map((spec, index) => (
                                                <div
                                                    key={index}
                                                    id={`form-field-specifications[${index}]`}  // Container ID for the whole spec item
                                                    className="space-y-3  bg-slate-50 p-2 rounded-lg border border-gray-100"
                                                >
                                                    <div className="flex flex-col sm:flex-row  gap-3 w-full">
                                                        <Input
                                                            id={`form-field-specifications[${index}].label`}  // ID for label input
                                                            placeholder="Name"
                                                            value={spec.label || ""}
                                                            onChange={(e) => {
                                                                const newSpecs = [...(field.value || [])];
                                                                newSpecs[index] = { ...newSpecs[index], label: e.target.value };
                                                                field.onChange(newSpecs);
                                                            }}
                                                        />
                                                        <Input
                                                            id={`form-field-specifications[${index}].value`}  // ID for value input
                                                            placeholder="Value"
                                                            value={spec.value || ""}
                                                            onChange={(e) => {
                                                                const newSpecs = [...(field.value || [])];
                                                                newSpecs[index] = { ...newSpecs[index], value: e.target.value };
                                                                field.onChange(newSpecs);
                                                            }}
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
                                                    field.onChange([...(field.value || []), { label: "", value: "" }]);
                                                }}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Specification
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="space-y-6  p-2 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-medium">Features</h3>
                        <FormField
                            control={form.control}
                            name="keyFeatures"
                            render={({ field }) => (
                                <FormItem id="form-field-keyFeatures">
                                    <FormLabel>Key Features</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            {field.value?.map((feature, index) => (
                                                <div key={index} id={`form-field-keyFeatures[${index}]`} className="space-y-3 bg-slate-50 p-2 rounded-lg border border-gray-100">
                                                    <div key={index} className="flex flex-row gap-3">
                                                        <Input
                                                            id={`form-field-specifications[${index}]`}
                                                            value={feature}
                                                            onChange={(e) => {
                                                                const newFeatures = [...field.value || []];
                                                                newFeatures[index] = e.target.value;
                                                                field.onChange(newFeatures);
                                                            }}
                                                            placeholder={`Feature ${index + 1}`}
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
                                                Add Feature
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-6  p-2 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-medium">Benefits</h3>
                        <FormField
                            control={form.control}
                            name="benefits"
                            render={({ field }) => (
                                <FormItem id="form-field-benefits">
                                    <FormLabel>Product Benefits</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {(field.value || []).map((benefit, index) => (
                                                <div key={index} id={`form-field-benefits[${index}]`} className="space-y-3 bg-slate-50 p-2 rounded-lg border border-gray-100">
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <Input
                                                            id={`form-field-benefits[${index}].icon`}
                                                            placeholder="Icon (e.g., check, star)"
                                                            value={benefit.icon || ""}
                                                            onChange={(e) => {
                                                                const newBenefits = [...(field.value || [])];
                                                                newBenefits[index] = { ...newBenefits[index], icon: e.target.value };
                                                                field.onChange(newBenefits);
                                                            }}
                                                        />
                                                        <Input
                                                            id={`form-field-benefits[${index}].title`}
                                                            placeholder="Title"
                                                            value={benefit.title || ""}
                                                            onChange={(e) => {
                                                                const newBenefits = [...(field.value || [])];
                                                                newBenefits[index] = { ...newBenefits[index], title: e.target.value };
                                                                field.onChange(newBenefits);
                                                            }}
                                                        />
                                                        <Input
                                                            id={`form-field-benefits[${index}].color`}
                                                            placeholder="Color (optional)"
                                                            value={benefit.color || ""}
                                                            onChange={(e) => {
                                                                const newBenefits = [...(field.value || [])];
                                                                newBenefits[index] = { ...newBenefits[index], color: e.target.value };
                                                                field.onChange(newBenefits);
                                                            }}
                                                        />
                                                    </div>

                                                    <Textarea
                                                        id={`form-field-benefits[${index}].description`}
                                                        placeholder="Description"
                                                        value={benefit.description || ""}
                                                        onChange={(e) => {
                                                            const newBenefits = [...(field.value || [])];
                                                            newBenefits[index] = { ...newBenefits[index], description: e.target.value };
                                                            field.onChange(newBenefits);
                                                        }}
                                                        className="min-h-[80px]"
                                                    />

                                                    <div className="flex justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full sm:w-auto"
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
                                                onClick={() => {
                                                    field.onChange([
                                                        ...(field.value || []),
                                                        { icon: "", title: "", description: "", color: "" }
                                                    ]);
                                                }}
                                                className="w-full sm:w-auto"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Benefit
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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