'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/hooks/use-toast';
import { ArrowLeft,  Code, Code2, ListTree, Loader2, Play, RefreshCw, Save } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LogoPreview from '@/components/custom/LogoPreview';
import { svgLogoSchema } from '@/schemas/logoSchema';
import { convertSvgToPaths, getActiveSvgLogo, saveSvgLogo } from '@/services/svglogo.services';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CodeEditorModal } from '@/components/dialogs/CodeEditorModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function LogoAdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(0);
    const [svgModalOpen, setSvgModalOpen] = useState(false);
    const [pathsModalOpen, setPathsModalOpen] = useState(false);

    // Initialize form with empty values matching svgLogoSchema
    const form = useForm<z.infer<typeof svgLogoSchema>>({
        resolver: zodResolver(svgLogoSchema),
        defaultValues: {
            svg: {
                viewBox: '',
                paths: '[]',
                source: ''
            }
        }
    });
    const handlePlayAnimation = () => {
        setAnimationTrigger(prev => prev + 1); // Increment to trigger animation
    };
    // Fetch logo data from API
    useEffect(() => {
        const fetchLogoData = async () => {
            setIsLoading(true);
            try {
                const logo = await getActiveSvgLogo();
                if (logo) {
                    form.reset({
                        svg: {
                            viewBox: logo.svg.viewBox,
                            paths: logo.svg.paths,
                            animation: logo.svg.animation,
                            source: logo.svg.source,
                            size: logo.svg.size,
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching logo:', error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to load logo configuration",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogoData();
    }, [form, toast]); // Dependencies are now stable

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof svgLogoSchema>) => {
        setIsSaving(true);
        try {
            const result = await saveSvgLogo(values);
            if (result) {
                toast({ title: "Success", description: "Logo saved successfully" });
                router.refresh();
            }
        } catch (error) {
            console.error('Error fetching logo:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load logo configuration",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };
    const handleConvertSVGPath = async () => {
        try {
            const svgCode = form.getValues('svg.source');
            if (!svgCode) return;
            // If you need the parsed paths:
            const conversionResult = await convertSvgToPaths(svgCode);
            if (conversionResult) {
                form.setValue('svg.viewBox', conversionResult.viewBox);
                form.setValue('svg.paths', JSON.stringify(conversionResult.paths, null, 2));
            }
            toast({
                title: "Success",
                description: "SVG converted successfully",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to convert SVG",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 space-y-6">
                <Skeleton className="h-8 w-24 rounded-md" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel */}
                    <Card className="space-y-6 p-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                        <Skeleton className="h-48 w-full rounded-lg" />
                    </Card>

                    {/* Right Panel */}
                    <div className="space-y-4">
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* SVG Code Editor Modal */}
            <CodeEditorModal
                open={svgModalOpen}
                onOpenChange={setSvgModalOpen}
                title="SVG Code Editor"
                description="Edit your SVG code directly. Changes will be applied when you save."
                initialValue={form.getValues('svg.source') || ""}
                onSave={(value) => form.setValue('svg.source', value)}
                language="svg"
            />

            {/* Paths Editor Modal */}
            <CodeEditorModal
                open={pathsModalOpen}
                onOpenChange={setPathsModalOpen}
                title="Paths Editor"
                description="Edit your paths configuration directly in JSON format."
                initialValue={form.getValues('svg.paths')}
                onSave={(value) => form.setValue('svg.paths', value)}
                language="json"
            />

            <Link
                href={"/admin/settings"}
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring    border border-neutral-300 bg-transparent hover:bg-neutral-50 shadow-sm text-neutral-700 h-8 rounded-md px-3"
            >
                <ArrowLeft className="h-4 w-4" /> BACK
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration Panel */}
                <Card className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">SVG Logo Configuration</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Customize your SVG logo properties
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* SVG Source Field */}
                                <FormField
                                    control={form.control}
                                    name="svg.source"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SVG Code</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[200px] font-mono text-sm"
                                                    {...field}
                                                    placeholder="<svg>...</svg>"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <div className="flex justify-end mt-2">
                                                <Button
                                                    type="button"
                                                    variant="tertiary"
                                                    size="sm"
                                                    onClick={handleConvertSVGPath}
                                                >
                                                    <Code2 className="mr-2 h-4 w-4" />
                                                    Convert SVG
                                                </Button>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* ViewBox Field */}
                                    <FormField
                                        control={form.control}
                                        name="svg.viewBox"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ViewBox</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0 0 100 100" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Size Field */}
                                    <FormField
                                        control={form.control}
                                        name="svg.size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Display Size (px)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="150"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Animation Settings */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2">
                                            <Play className="h-5 w-5 text-primary" />
                                            Animation Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="svg.animation.duration"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Duration (s)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                min="0.1"
                                                                {...field}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="svg.animation.delayMultiplier"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Delay Multiplier</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                min="0"
                                                                {...field}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={handlePlayAnimation}
                                        >
                                            <Play className="mr-2 h-4 w-4" />
                                            Preview Animation
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Paths Configuration */}
                                <FormField
                                    control={form.control}
                                    name="svg.paths"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel>Paths Configuration</FormLabel>
                                                <Badge variant="outline">
                                                    {JSON.parse(field.value || '[]').length} paths
                                                </Badge>
                                            </div>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[200px] font-mono text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Logo Configuration
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Preview Panel */}
                <div className="space-y-6">
                    <Card className="h-fit">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl md:text-2xl font-bold">Logo Preview</CardTitle>
                                <div className="flex gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSvgModalOpen(true)}
                                            >
                                                <Code className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>View SVG Code</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPathsModalOpen(true)}
                                            >
                                                <ListTree className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>View Paths</TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <LogoPreview
                                        svg={{
                                            viewBox: form.watch('svg.viewBox'),
                                            paths: form.watch('svg.paths'),
                                            animation: form.watch('svg.animation'),
                                            size: form.watch('svg.size') || 150,
                                        }}
                                        animationTrigger={animationTrigger}
                                        className=" w-fit"
                                    />
                                </div>

                                {/* New Action Buttons Row */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setSvgModalOpen(true)}
                                        className="gap-2"
                                    >
                                        <Code className="h-4 w-4" />
                                        Edit SVG Code
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setPathsModalOpen(true)}
                                        className="gap-2"
                                    >
                                        <ListTree className="h-4 w-4" />
                                        Edit Paths
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Preview Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {/* <div className="space-y-2">
                                    <Label>Background</Label>
                                    <Select
                                        value={previewBackground}
                                        onValueChange={(value) => setPreviewBackground(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select background" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="transparent">Transparent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div> */}
                                <div className="space-y-2">
                                    <Label>Preview Size: {form.watch('svg.size') || 150}px</Label>
                                    <Slider
                                        value={[form.watch('svg.size') || 150]}
                                        max={500}
                                        min={50}
                                        step={10}
                                        onValueChange={(value) => form.setValue('svg.size', value[0])}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}