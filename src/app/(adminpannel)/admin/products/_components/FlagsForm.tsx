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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { IProduct, IProductFlags, ProductFlagsSchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { updateProductSection } from "@/services/product.services";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface FlagsFormProps {
  initialData?: IProductFlags;
  onSuccess: () => void;
  isLoading: boolean;
  productId: string;
}

export function FlagsForm({
  initialData,
  onSuccess,
  isLoading,
  productId,
}: FlagsFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ProductFlagsSchema>>({
    resolver: zodResolver(ProductFlagsSchema),
    defaultValues: initialData || {
      isNewProduct: false,
      isBanner: false,
      isHighlighted: false,
      isActive: true,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  async function onSubmit(values: IProductFlags) {
    try {
      setIsSubmitting(true)
      const response = await updateProductSection<Partial<IProduct>>(
        productId,
        "flags",
        values
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Flags updated successfully",
        });
        onSuccess();
      } else {
        throw new Error(response.error || "Failed to update flags");
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
            name="isNewProduct"
            render={({ field }) => (
              <FormItem id="form-field-isNewProduct" className="flex flex-row items-center justify-between rounded-lg border p-4  border-gray-200">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">New Product Badge</FormLabel>
                  <FormDescription>
                    Show this badge if the product is marked as a Banner Product.
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
          <FormField

            control={form.control}
            name="isBanner"
            render={({ field }) => (
              <FormItem id="form-field-isBanner" className="flex flex-row items-center justify-between rounded-lg border p-4 border-gray-300">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Banner Product</FormLabel>
                  <FormDescription>
                    Is this product Banner Product ?
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
          <FormField
            control={form.control}
            name="isHighlighted"
            render={({ field }) => (
              <FormItem id="form-field-isHighlighted" className="flex flex-row items-center justify-between rounded-lg border p-4  border-gray-300">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Highlighted Product</FormLabel>
                  <FormDescription>
                    Display this product on the homepage?
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
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem id="form-field-isActive" className="flex flex-row items-center justify-between rounded-lg border p-4  border-gray-300">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Product</FormLabel>
                  <FormDescription>
                    Show this product in the product list?
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