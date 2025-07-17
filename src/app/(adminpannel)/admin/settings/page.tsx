"use client";
import { useEffect, useState } from "react";
import { ISettings } from "@/schemas/settingsSchema";
import { fetchSettings } from "@/services/settings.services";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useRef } from "react";
import { useGesture } from "@use-gesture/react";
// Form components
import { WebsiteInfoForm } from "./_components/WebsiteInfoForm";
import { HeroSectionForm } from "./_components/HeroSectionForm";
import { OurStoryForm } from "./_components/OurStoryForm";
import { FooterForm } from "./_components/FooterForm";
import { WeWorkAcrossForm } from "./_components/WeWorkAcrossForm";
import { Book, Globe, ImageUp, Layout, Map, Settings } from "lucide-react";
import { getActiveSvgLogo } from "@/services/svglogo.services";
import { useToast } from "@/components/hooks/use-toast";
import { ISvgLogo } from "@/schemas/logoSchema";

export default function SettingsPage() {
    const { toast } = useToast();
    const [svgLogo, setSvgLogo] = useState<ISvgLogo | null>(null);
    const [activeTab, setActiveTab] = useState("website");
    const [settings, setSettings] = useState<ISettings | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogoLoading, setIsLogoLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);

    const bind = useGesture({
        onDrag: ({ movement: [, my], last }) => {
            if (my > 0) { // Only respond to downward swipes
                if (last && my > 50) { // If swipe distance is significant
                    setMobileMenuOpen(false);
                }
            }
        }
    });

    useEffect(() => {
        async function loadAllData() {
            try {
                setIsLoading(true);
                setIsLogoLoading(true);
                
                // Fetch both settings and logo in parallel
                const [settingsData, logoData] = await Promise.all([
                    fetchSettings(),
                    getActiveSvgLogo()
                ]);
                
                if (settingsData) {
                    setSettings(settingsData?.data);
                }
                
                if (logoData) {
                    setSvgLogo(logoData);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to load data",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
                setIsLogoLoading(false);
            }
        }
        
        loadAllData();
    }, [refreshKey, toast]);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    const tabItems = [
        {
            value: "website",
            label: "Website Info",
            icon: <Globe className="w-5 h-5" />,
            component: (
                <WebsiteInfoForm
                    initialData={settings?.websiteInfo}
                    onSuccess={handleSuccess}
                    svgLogo={svgLogo}
                    isLoading={isLoading || isLogoLoading}
                />
            )
        },
        {
            value: "hero",
            label: "Hero Section",
            icon: <ImageUp className="w-5 h-5" />,
            component: (
                <HeroSectionForm
                    initialData={settings?.heroSection}
                    onSuccess={handleSuccess}
                    // isLoading={isLoading}
                />
            )
        },
        {
            value: "story",
            label: "Our Story",
            icon: <Book className="w-5 h-5" />,
            component: (
                <OurStoryForm
                    initialData={settings?.ourStorySection}
                    onSuccess={handleSuccess}
                    // isLoading={isLoading}
                />
            )
        },
        {
            value: "work",
            label: "Work Areas",
            icon: <Map className="w-5 h-5" />,
            component: (
                <WeWorkAcrossForm
                    initialData={settings?.weWorkAcross}
                    onSuccess={handleSuccess}
                    // isLoading={isLoading}
                />
            )
        },
        {
            value: "footer",
            label: "Footer",
            icon: <Layout className="w-5 h-5" />,
            component: (
                <FooterForm
                    initialData={settings?.footerSection}
                    onSuccess={handleSuccess}
                    // isLoading={isLoading}
                />
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar skeleton - hidden on mobile */}
                    <div className="hidden md:block w-full md:w-64 space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 rounded-lg" />
                        ))}
                    </div>
                    {/* Content skeleton */}
                    <div className="flex-1">
                        <Skeleton className="h-[600px] rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-1">
            {/* Mobile header - only shown on small screens */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        className="rounded-t-2xl h-[50vh] touch-none"
                        ref={sheetRef}
                        {...bind()}
                    >
                        {/* Swipe indicator handle */}
                        <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mb-4" />

                        <SheetHeader className="text-left mb-6">
                            <SheetTitle>Settings Menu</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-2">
                            {tabItems.map((tab) => (
                                <Button
                                    key={tab.value}
                                    variant={activeTab === tab.value ? "muted" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        activeTab === tab.value && "font-semibold"
                                    )}
                                    onClick={() => {
                                        setActiveTab(tab.value);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Desktop sidebar - hidden on mobile */}
                <div className="hidden lg:block w-full md:w-36">
                    <div className="sticky top-20 space-y-1">
                        <h2 className="text-lg font-semibold mb-4">Settings</h2>
                        {tabItems.map((tab) => (
                            <Button
                                key={tab.value}
                                variant={activeTab === tab.value ? "muted" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 px-4 py-2",
                                    activeTab === tab.value && "font-semibold"
                                )}
                                onClick={() => setActiveTab(tab.value)}
                            >
                                {tab.icon}
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 bg-background rounded-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className=" shadow-sm"
                        >
                            {/* Mobile tab indicator - only shown on mobile */}
                            <div className="bg-slate-700 text-slate-200 rounded-md flex items-center justify-center gap-2 lg:hidden py-1">
                                {tabItems.find(tab => tab.value === activeTab)?.icon}
                                <h2 className="text-xl font-semibold">
                                    {tabItems.find(tab => tab.value === activeTab)?.label}
                                </h2>
                            </div>

                            {tabItems.find(tab => tab.value === activeTab)?.component}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile floating action button - only shown on mobile */}
            <div className="fixed bottom-6 right-6 lg:hidden z-50">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Button
                        size="icon"
                        className={cn(
                            "relative rounded-full w-16 h-16",
                            "bg-gradient-to-br from-indigo-600 to-purple-500",
                            "shadow-lg hover:shadow-xl",
                            "transition-all duration-300",
                            "group overflow-hidden"
                        )}
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        {/* Floating particles background */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute bg-white/20 rounded-full"
                                    initial={{
                                        x: Math.random() * 40 - 20,
                                        y: Math.random() * 40 - 20,
                                        width: Math.random() * 6 + 2,
                                        height: Math.random() * 6 + 2,
                                    }}
                                    animate={{
                                        x: Math.random() * 80 - 40,
                                        y: Math.random() * 80 - 40,
                                        opacity: [0.2, 0.8, 0.2],
                                    }}
                                    transition={{
                                        duration: Math.random() * 3 + 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Animated icon */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Settings className="w-6 h-6 text-white" />
                        </motion.div>

                        {/* Pulse effect */}
                        <motion.span
                            className="absolute inset-0 border-2 border-white/30 rounded-full"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0, 0.5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />

                        {/* Glow effect */}
                        <span className="absolute inset-0 rounded-full shadow-[0_0_15px_5px_rgba(99,102,241,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}