"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IPolicySection, PolicySectionSchema } from "@/schemas/settingsSchema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/hooks/use-toast";
import { Loader } from "lucide-react";
import { useState } from "react";
import { updatePolicySection } from "@/services/settings.services";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import RichTextEditor from "@/components/custom/CustomRichTextEditor";

interface PolicyFormProps {
    initialData?: IPolicySection;
    onSuccess?: () => void;
}

export function PolicyForm({ initialData, onSuccess }: PolicyFormProps) {
    const form = useForm<IPolicySection>({
        resolver: zodResolver(PolicySectionSchema),
        defaultValues: initialData || {
            privacyPolicy: "",
            termsAndConditions: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IPolicySection) {
        try {
            setIsSubmitting(true);
            const response = await updatePolicySection(values);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Policy section updated successfully",
                });
                onSuccess?.();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to update Policy section",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(`ERROR : ${error}`)
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormField
                    control={form.control}
                    name="privacyPolicy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Privacy Policy</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    content={field.value || ""}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="termsAndConditions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Terms & Conditions</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    content={field.value || ""}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Form Actions */}
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
                        {initialData ? "Update Setting" : "Create Setting"}
                    </Button>
                </div>

                {/* Reset Confirmation Dialog */}
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
    );
}