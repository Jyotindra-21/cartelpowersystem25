// app/admin/settings/_components/OurStoryForm.tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { OurStorySectionSchema, IOurStorySection } from "@/schemas/settingsSchema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/hooks/use-toast";
import { Loader, Plus, Trash } from "lucide-react";
import ImageUpload from "@/components/custom/ImageUpload";
import RichEditor from "@/components/custom/RichEditor";
import { useState } from "react";
import { updateOurStorySection } from "@/services/settings.services";
import { useOurStoryFieldArrays } from "./useSettingsFieldArrays";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";

interface OurStoryFormProps {
    initialData?: IOurStorySection;
    onSuccess?: () => void;
}

export function OurStoryForm({ initialData, onSuccess }: OurStoryFormProps) {
    const form = useForm<IOurStorySection>({
        resolver: zodResolver(OurStorySectionSchema),
        defaultValues: initialData || {
            titleDesc: "",
            image: "",
            description: "",
            storyTeller: "",
            position: "",
            quote: "",
            isMissionView: false,
            missionDescription: "",
            companyStats: [],
        },
    });


    const { companyStats } = useOurStoryFieldArrays(form.control)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IOurStorySection) {
        try {
            setIsSubmitting(true);
            const response = await updateOurStorySection(values);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Our Story section updated successfully",
                });
                onSuccess?.();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to update Our Story section",
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
                    name="titleDesc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title Description</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <RichEditor
                                    content={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="storyTeller"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Story Teller</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="quote"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quote</FormLabel>
                            <FormControl>
                                <Textarea rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isMissionView"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Show Mission View</FormLabel>
                                <FormDescription>
                                    Enable to display the mission section
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

                {form.watch("isMissionView") && (
                    <FormField
                        control={form.control}
                        name="missionDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mission Description</FormLabel>
                                <FormControl>
                                    <RichEditor
                                        content={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                    {/* <Textarea rows={4} {...field} /> */}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Company Stats */}
                <div className="space-y-4 border border-slate-100 p-2 rounded-md">
                    <FormLabel className="mr-4">Company Stats</FormLabel>
                    {companyStats.fields.map((stat, index) => (
                        <div key={stat.id} className="flex flex-col sm:flex-row  gap-3 w-full p-2 bg-slate-50 border border-slate-100 rounded-md">
                            <FormField
                                control={form.control}
                                name={`companyStats.${index}.label`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Stat label" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`companyStats.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Stat value" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`companyStats.${index}.icon`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Icon URL" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`companyStats.${index}.color`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Color code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-auto"
                                size="sm"
                                onClick={() => companyStats.remove(index)}
                            >
                                <Trash className="h-4 w-4 sm:mr-2" />
                                <span className="sr-only sm:not-sr-only">Remove</span>
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => companyStats.append({ label: "", value: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company Stat
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