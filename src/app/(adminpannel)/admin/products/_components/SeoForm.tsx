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
import { IProduct, IProductSeo, ProductSeoSchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { updateProductSection } from "@/services/product.services";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { Loader } from "lucide-react";

interface SeoFormProps {
  initialData?: IProductSeo;
  onSuccess: () => void;
  isLoading: boolean;
  productId: string;
}

export function SeoForm({
  initialData,
  onSuccess,
  isLoading,
  productId,
}: SeoFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ProductSeoSchema>>({
    resolver: zodResolver(ProductSeoSchema),
    defaultValues: initialData || {
      seoTitle: "",
      seoDescription: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  async function onSubmit(values: IProductSeo) {
    try {
      setIsSubmitting(true)
      const response = await updateProductSection<Partial<IProduct>>(
        productId,
        "seo",
        values
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "SEO updated successfully",
        });
        onSuccess();
      } else {
        throw new Error(response.error || "Failed to update SEO");
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
            name="seoTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Best product for..."
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
            name="seoDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="This product is..."
                    {...field}
                    disabled={isLoading}
                    className="min-h-[100px]"
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