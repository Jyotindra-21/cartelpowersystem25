"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HeroSectionScheme, IHeroSection } from "@/schemas/settingsSchema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/hooks/use-toast";
import { Loader, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { updateHeroSection } from "@/services/settings.services";
import { PositionSelect } from "./PositionSelect";
import { useHeroSectionFieldArrays } from "./useSettingsFieldArrays";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";

interface HeroSectionFormProps {
    initialData?: IHeroSection;
    onSuccess?: () => void;
}

export function HeroSectionForm({ initialData, onSuccess }: HeroSectionFormProps) {
    const form = useForm<IHeroSection>({
        resolver: zodResolver(HeroSectionScheme),
        defaultValues: initialData || {
            floatingFeature: [],
            head: "",
            title: "",
            description: "",
            features: [],
        },
    });

    const { floatingFeatures, features } = useHeroSectionFieldArrays(form.control)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IHeroSection) {
        try {
            setIsSubmitting(true);
            const response = await updateHeroSection(values);
            if (response.success) {
                toast({
                    title: "Success",
                    description: "Hero section updated successfully",
                });
                onSuccess?.();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to update hero section",
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2 sm:space-y-6 sm:p-4">
                {/* Head Field */}
                <FormField
                    control={form.control}
                    name="head"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Head</FormLabel>
                            <FormControl>
                                <Input {...field} className="text-sm sm:text-base" />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                {/* Title Field */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Title</FormLabel>
                            <FormControl>
                                <Input {...field} className="text-sm sm:text-base" />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                {/* Description Field */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Description</FormLabel>
                            <FormControl>
                                <Textarea rows={3} {...field} className="text-sm sm:text-base min-h-[100px]" />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                {/* Floating Features Section */}
                <div className="space-y-4 rounded-md p-2 border border-slate-200">
                    <FormLabel className="mr-4">Floating Features</FormLabel>
                    {floatingFeatures.fields.map((feature, index) => (
                        <div key={feature.id} className="flex flex-col sm:flex-row  gap-3 w-full bg-slate-50 p-2 border border-slate-100 rounded-md">
                            <FormField
                                control={form.control}
                                name={`floatingFeature.${index}.label`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Feature label" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`floatingFeature.${index}.position`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <PositionSelect

                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`floatingFeature.${index}.icon`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Icon" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="w-auto"
                                onClick={() => floatingFeatures.remove(index)}
                            >
                                <Trash className="h-4 w-4 sm:mr-2" />
                                <span className="sr-only sm:not-sr-only">Remove</span>
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => floatingFeatures.append({ label: "", position: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Floating Feature
                    </Button>
                </div>


                {/* Features List */}
                <div className="space-y-4 border border-slate-200 p-2 rounded-md">
                    <FormLabel className="mr-4">Features List</FormLabel>
                    {features.fields.map((feature, index) => (
                        <div key={feature.id} className="flex gap-4 bg-slate-50 border border-slate-200 rounded-md p-2">
                            <FormField
                                control={form.control}
                                name={`features.${index}.label`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Feature text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="w-auto"
                                onClick={() => features.remove(index)}
                            >
                                <Trash className="h-4 w-4 sm:mr-2" />
                                <span className="sr-only sm:not-sr-only">Remove</span>
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => features.append({ label: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Feature
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