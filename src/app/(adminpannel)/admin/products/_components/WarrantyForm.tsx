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
import { IProduct, IProductWarranty, ProductWarrantySchema } from "@/schemas/productsSchema";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { updateProductSection } from "@/services/product.services";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { useState } from "react";
import { Loader } from "lucide-react";

interface WarrantyFormProps {
  initialData?: IProductWarranty;
  onSuccess: () => void;
  isLoading: boolean;
  productId: string;
}

export function WarrantyForm({
  initialData,
  onSuccess,
  isLoading,
  productId,
}: WarrantyFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ProductWarrantySchema>>({
    resolver: zodResolver(ProductWarrantySchema),
    defaultValues: initialData || {
      warranty: "",
      warrantyDuration: "",
      supportInfo: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  async function onSubmit(values: IProductWarranty) {
    try {
      setIsSubmitting(true)
      const response = await updateProductSection<Partial<IProduct>>(
        productId,
        "warranty",
        values
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Warranty info updated successfully",
        });
        onSuccess();
      } else {
        throw new Error(response.error || "Failed to update warranty info");
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
            name="warranty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warranty *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1 year limited warranty"
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
            name="warrantyDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warranty Duration</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12 months"
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
            name="supportInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contact support at..."
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