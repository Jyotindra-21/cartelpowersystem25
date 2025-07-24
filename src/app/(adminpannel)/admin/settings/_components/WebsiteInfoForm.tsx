"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WebsiteSchema, IWebsiteInfo } from "@/schemas/settingsSchema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/hooks/use-toast";
import ImageUpload from "@/components/custom/ImageUpload";
import { Loader, Pen, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { updateWebsiteInfo } from "@/services/settings.services";

import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { ISvgLogo } from "@/schemas/logoSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LogoPreview from "@/components/custom/LogoPreview";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface WebsiteInfoFormProps {
    initialData?: IWebsiteInfo;
    svgLogo?: ISvgLogo | null
    onSuccess?: () => void;
    isLoading: boolean;
}

export function WebsiteInfoForm({ initialData, svgLogo, onSuccess, isLoading }: WebsiteInfoFormProps) {
    const form = useForm<IWebsiteInfo>({
        resolver: zodResolver(WebsiteSchema),
        defaultValues: initialData || {
            logo: "",
            svg: "",
            isSvg: true,
            tagLine: "",
            metaTitle: "",
            metaDescription: "",
            metaData: "",
            metaTags: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(0);

    useEffect(() => {
        if (!isLoading && initialData) {
            form.reset(initialData);
        }
    }, [initialData, isLoading, form]);

    async function onSubmit(values: IWebsiteInfo) {
        try {
            setIsSubmitting(true);
            const response = await updateWebsiteInfo(values);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Website info updated successfully",
                });
                onSuccess?.();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to update website info",
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
    const handlePlayAnimation = () => {
        setAnimationTrigger(prev => prev + 1); // Increment to trigger animation
    };

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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormField
                    control={form.control}
                    name="isSvg"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Use SVG</FormLabel>
                                <FormDescription>
                                    This image use as logo.
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
                {!form.watch("isSvg") && <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />}
                {form.watch("isSvg") && (
                    <div className="space-y-6">
                        <Card className="h-fit">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-md">SVG Logo Preview</CardTitle>
                                    <div className="flex gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handlePlayAnimation}
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Replay Animation</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={"/admin/svglogo"}
                                                    type="button"
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring    border border-neutral-300 bg-transparent hover:bg-neutral-50 shadow-sm text-neutral-700 h-8 rounded-md px-3"
                                                >
                                                    <Pen className="h-4 w-4" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>Edit SVG Logo</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <LogoPreview
                                            svg={{
                                                viewBox: svgLogo?.svg?.viewBox || "",
                                                paths: svgLogo?.svg?.paths || "",
                                                animation: svgLogo?.svg?.animation,
                                                size: svgLogo?.svg?.size || 150,
                                            }}
                                            animationTrigger={animationTrigger}
                                            className=" w-fit"
                                        />
                                    </div>


                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="tagLine"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tag Line</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                                <Textarea rows={3} {...field} />
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
                        {initialData ? "Update Setting" : "Create Setting"}
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
    );
}