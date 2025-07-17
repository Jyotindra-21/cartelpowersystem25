// app/admin/settings/_components/FooterForm.tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FooterSchema, IFooterSection } from "@/schemas/settingsSchema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/hooks/use-toast";
import { Loader, Plus, Trash } from "lucide-react";
import ImageUpload from "@/components/custom/ImageUpload";
import { useState } from "react";
import { updateFooterSection } from "@/services/settings.services";
import { useFooterSectionFieldArrays } from "./useSettingsFieldArrays";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";

interface FooterFormProps {
    initialData?: IFooterSection;
    onSuccess?: () => void;
}

export function FooterForm({ initialData, onSuccess }: FooterFormProps) {
    const form = useForm<IFooterSection>({
        resolver: zodResolver(FooterSchema),
        defaultValues: initialData || {
            socialMedia: [],
            quickLinks: [],
            technology: [],
            contactDetails: {
                address: "",
                phone: "",
                email: "",
            },
            whyContactUs: [],
        },
    });

    const { quickLinks, socialMedia, technologies, whyContactUs } = useFooterSectionFieldArrays(form.control)


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    async function onSubmit(values: IFooterSection) {
        try {
            setIsSubmitting(true);
            const response = await updateFooterSection(values);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Footer section updated successfully",
                });
                onSuccess?.();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to update footer section",
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
                {/* Footer Section */}
                {/* <div className="space-y-6 p-2 border rounded-lg"> */}
                {/* <h3 className="text-lg font-medium">Footer Section</h3> */}

                {/* Social Media */}
                <div className="space-y-4 border border-slate-100 rounded-md -2 p-2">
                    <FormLabel className="mr-4">Social Media</FormLabel>
                    {socialMedia.fields.map((media, index) => (
                        <div key={media.id} className="flex flex-col sm:flex-row  gap-3 w-full bg-slate-50 p-2 border border-slate-100 rounded-md">
                            <FormField
                                control={form.control}
                                name={`socialMedia.${index}.icon`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Icon class" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`socialMedia.${index}.svg`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="SVG path" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`socialMedia.${index}.url`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="URL" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`socialMedia.${index}.isSvg`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is SVG?</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-auto"
                                size="sm"
                                onClick={() => socialMedia.remove(index)}
                            >
                                <Trash className="h-4 w-4 sm:mr-2" />
                                <span className="sr-only sm:not-sr-only">Remove</span>
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => socialMedia.append({ isSvg: false })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Social Media
                    </Button>
                </div>

                {/* Quick Links */}
                <div className="space-y-4 border border-slate-200 rounded-md -2 p-2">
                    <FormLabel className="mr-4">Quick Links</FormLabel>
                    {quickLinks.fields.map((link, index) => (
                        <div key={link.id} className="flex flex-col sm:flex-row  gap-3 w-full bg-slate-50 p-2 border border-slate-200 rounded-md">
                            <FormField
                                control={form.control}
                                name={`quickLinks.${index}.title`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Link title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`quickLinks.${index}.link`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input placeholder="Routes" {...field} />
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
                                onClick={() => quickLinks.remove(index)}
                            >
                                <Trash className="h-4 w-4 sm:mr-2" />
                                <span className="sr-only sm:not-sr-only">Remove</span>
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => quickLinks.append({ title: "", link: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Quick Link
                    </Button>
                </div>

                {/* Technology */}
                <div className="space-y-4 border border-slate-200 rounded-md -2 p-2">
                    <FormLabel className="mr-4">Technology</FormLabel>
                    {technologies.fields?.length > 0 && <div className=" grid grid-cols-1 md:grid-cols-2 sm:flex-row  gap-3 w-full bg-slate-50 p-2 border border-slate-200 rounded-md">
                        {technologies.fields.map((tech, index) => (
                            <div key={tech.id} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name={`technology.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Technology name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`technology.${index}.fileUrl`}
                                    render={({ field }) => (
                                        <FormItem id={`form-field-technology.${index}.fileUrl`} className="mb-6">
                                            <FormControl>
                                                <ImageUpload
                                                    name={`technology.${index}.fileUrl`}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="w-auto"
                                        size="sm"
                                        onClick={() => technologies.remove(index)}
                                    >
                                        <Trash className="h-4 w-4 sm:mr-2" />
                                        <span className="sr-only sm:not-sr-only">Remove</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => technologies.append({ title: "", fileUrl: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Technology
                    </Button>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                    <h4 className="text-md font-medium">Contact Details</h4>
                    <FormField
                        control={form.control}
                        name="contactDetails.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contactDetails.phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contactDetails.email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Why Contact Us */}
                    <div className="space-y-4 border border-slate-200 rounded-md -2 p-2">
                        <FormLabel className="mr-4">Why Contact Us</FormLabel>
                        {whyContactUs.fields.map((item, index) => (
                            <div key={item.id} className="flex gap-4 bg-slate-50 p-2 border border-slate-200 rounded-md">
                                <FormField
                                    control={form.control}
                                    name={`whyContactUs.${index}.label`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Reason to contact" {...field} />
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
                                    onClick={() => whyContactUs.remove(index)}
                                >
                                    <Trash className="h-4 w-4 sm:mr-2" />
                                    <span className="sr-only sm:not-sr-only">Remove</span>
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => whyContactUs.append({ label: "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Reason
                        </Button>
                    </div>
                </div>
                {/* </div> */}

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