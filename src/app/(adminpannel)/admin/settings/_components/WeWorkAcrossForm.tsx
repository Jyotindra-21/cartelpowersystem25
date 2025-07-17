// app/admin/settings/_components/WeWorkAcrossForm.tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/hooks/use-toast";
import { Loader, Plus, Trash } from "lucide-react";
import ImageUpload from "@/components/custom/ImageUpload";
import { useState } from "react";
import { updateWeWorkAcross } from "@/services/settings.services";
import { IWeWorkAcrossSection, WeWorkAcross } from "@/schemas/settingsSchema";
import { useWeWorkAcrossFieldArrays } from "./useSettingsFieldArrays";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";

interface WeWorkAcrossFormProps {
    initialData?: IWeWorkAcrossSection;
    onSuccess?: () => void;
}

export function WeWorkAcrossForm({ initialData, onSuccess }: WeWorkAcrossFormProps) {
    const form = useForm<IWeWorkAcrossSection>({
        resolver: zodResolver(WeWorkAcross),
        defaultValues: initialData || {
            workAcross: "",
            isWorkAcrossView: true,
            workAcrossCities: [],
        },
    });


    const { workAcrossCities } = useWeWorkAcrossFieldArrays(form.control)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IWeWorkAcrossSection) {
        try {
            setIsSubmitting(true);
            const response = await updateWeWorkAcross(values);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "We Work Across section updated successfully",
                });
                onSuccess?.();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to update We Work Across section",
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
                    name="workAcross"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Work Across Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isWorkAcrossView"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Show Section</FormLabel>
                                <FormDescription>
                                    Enable to display the We Work Across section
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

                {/* Work Across Cities */}
                <div className="space-y-4">
                    <FormLabel className="mr-4">Cities</FormLabel>
                    {workAcrossCities.fields?.length > 0 && <div className="grid md:grid-cols-2  sm:flex-row  gap-3 w-full">
                        {workAcrossCities.fields.map((city, index) => (
                            <div key={city.id} >
                                <div className="space-y-4 bg-slate-50   border border-slate-100 p-2 rounded-md">
                                    <FormField
                                        control={form.control}
                                        name={`workAcrossCities.${index}.cityName`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="City name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`workAcrossCities.${index}.atl`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Alt text" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`workAcrossCities.${index}.cityImage`}
                                        render={({ field }) => (
                                            <FormItem id={`form-field-weWorkAcross.workAcrossCities.${index}.cityImage`} className="mb-6">

                                                <FormControl>
                                                    <ImageUpload
                                                        name={`workAcrossCities.${index}.cityImage`}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="w-auto"
                                            size="sm"
                                            onClick={() => workAcrossCities.remove(index)}
                                        >
                                            <Trash className="h-4 w-4 sm:mr-2" />
                                            <span className="sr-only sm:not-sr-only">Remove</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => workAcrossCities.append({ cityName: "", cityImage: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add City
                    </Button>
                </div>

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