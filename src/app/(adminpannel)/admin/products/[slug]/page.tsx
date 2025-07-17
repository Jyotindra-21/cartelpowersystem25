"use client";
import { useEffect, useState } from "react";
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
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
// Form components
import {
    Box,
    IndianRupee,
    FileText,
    Layers,
    List,
    Shield,
    Tag,
    TrendingUp,
    Menu,
    Flag,
    ImageUp,
} from "lucide-react";
import mongoose from "mongoose";
import { fetchProductByIdOrSlug } from "@/services/product.services";
import { BasicInfoForm } from "../_components/BasicInfoForm";
import { IProduct } from "@/schemas/productsSchema";
import { MediaForm } from "../_components/MediaForm";
import { PricingForm } from "../_components/PricingForm";
import { InventoryForm } from "../_components/InventoryForm";
import { FeaturesForm } from "../_components/FeaturesForm";
import { WarrantyForm } from "../_components/WarrantyForm";
import { FlagsForm } from "../_components/FlagsForm";
import { SeoForm } from "../_components/SeoForm";
import { ResourcesForm } from "../_components/ResourcesForm";
import { TagsForm } from "../_components/TagsForm";

export default function ProductManagement() {
    const { toast } = useToast();
    const { slug } = useParams();
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("basic");
    const [product, setProduct] = useState<IProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);

    const bind = useGesture({
        onDrag: ({ movement: [, my], last }) => {
            if (my > 0) {
                if (last && my > 50) {
                    setMobileMenuOpen(false);
                }
            }
        },
    });

    useEffect(() => {
        async function loadProductData() {
            try {
                setIsLoading(true);
                if (slug === "new") {
                    // Initialize a new product with default values
                    setProduct({
                        _id: new mongoose.Types.ObjectId(),
                        basicInfo: {
                            name: "",
                            description: "",
                            shortDescription: "",
                            brand: "",
                            slug: "",
                        },
                        media: {
                            mainImage: "",
                            images: [],
                        },
                        pricing: {
                            hasDiscount: false,
                            price: 0,
                            taxIncluded: false,
                        },
                        inventory: {
                            stockQuantity: 0,
                            inStock: true,
                            sku: "",
                        },
                        featuresSection: {
                            features: [],
                            keyFeatures: [],
                            specifications: [],
                            benefits: [],
                        },
                        tags: {
                            tags: [],
                        },
                        ratingsAndReview: {
                            rating: 0,
                            reviewCount: 0,
                        },
                        warranty: {
                            warranty: "",
                        },
                        flags: {
                            isNewProduct: false,
                            isBanner: false,
                            isHighlighted: false,
                            isActive: true,
                        },
                        seo: {
                            seoTitle: "",
                            seoDescription: "",
                        },
                        resources: {
                            relatedProducts: [],
                        },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                } else {
                    const [productData] = await Promise.all([
                        fetchProductByIdOrSlug<IProduct>(slug as string)
                    ]);
                    if (productData?.success && productData?.data) {
                        setProduct(productData?.data);
                    }
                }
            } catch (error) {
                console.error("Failed to load product:", error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to load product data",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        loadProductData();
    }, [slug, refreshKey, toast]);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleSlugChange = (newSlug: string) => {
        if (newSlug !== slug) {
            router.push(newSlug)
        }
    }

    const tabItems = [
        {
            value: "basic",
            label: "Basic Info",
            icon: <Box className="w-5 h-5" />,
            component: (
                <BasicInfoForm
                    initialData={product?.basicInfo}
                    onSuccess={handleSuccess}
                    onSlugChange={handleSlugChange}
                    isLoading={isLoading}
                    isNewProduct={slug === "new"}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "media",
            label: "Media",
            icon: <ImageUp className="w-5 h-5" />,
            component: (
                <MediaForm
                    initialData={product?.media}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "pricing",
            label: "Pricing",
            icon: <IndianRupee className="w-5 h-5" />,
            component: (
                <PricingForm
                    initialData={product?.pricing}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "inventory",
            label: "Inventory",
            icon: <Layers className="w-5 h-5" />,
            component: (
                <InventoryForm
                    initialData={product?.inventory}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "features",
            label: "Features",
            icon: <List className="w-5 h-5" />,
            component: (
                <FeaturesForm
                    initialData={product?.featuresSection}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "tags",
            label: "Tags",
            icon: <Tag className="w-5 h-5" />,
            component: (
                <TagsForm
                    initialData={product?.tags}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "warranty",
            label: "Warranty",
            icon: <Shield className="w-5 h-5" />,
            component: (
                <WarrantyForm
                    initialData={product?.warranty}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "flags",
            label: "Flags",
            icon: <Flag className="w-5 h-5" />,
            component: (
                <FlagsForm
                    initialData={product?.flags}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "seo",
            label: "SEO",
            icon: <TrendingUp className="w-5 h-5" />,
            component: (
                <SeoForm
                    initialData={product?.seo}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
        {
            value: "resources",
            label: "Resources",
            icon: <FileText className="w-5 h-5" />,
            component: (
                <ResourcesForm
                    initialData={product?.resources}
                    onSuccess={handleSuccess}
                    isLoading={isLoading}
                    productId={slug as string}
                />
            ),
        },
    ];

    if (isLoading && slug !== "new") {
        return (
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar skeleton - hidden on mobile */}
                    <div className="hidden md:block w-full md:w-64 space-y-2">
                        {[...Array(9)].map((_, i) => (
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
                <h1 className="text-2xl font-bold">
                    {slug === "new" ? "New Product" : "Edit Product"}
                </h1>

                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        className="rounded-t-2xl h-[75vh] touch-none"
                        ref={sheetRef}
                        {...bind()}
                    >
                        {/* Swipe indicator handle */}
                        <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mb-4" />

                        <SheetHeader className="text-left mb-6">
                            <SheetTitle>Product Sections</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-2 overflow-y-auto max-h-[60vh]">
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
                <div className="hidden lg:block w-full md:w-48">
                    <div className="sticky top-20 space-y-1">
                        <div className="flex justify-between">
                            <h2 className="text-lg font-semibold mb-4">
                                {slug === "new" ? "New Product" : "Edit Product"}
                            </h2>
                            <Button
                                size="xs"
                                type="button"
                                variant="destructive"
                                className="w-full sm:w-auto"
                                onClick={() => router.push("/admin/products")}
                            >
                                Cancel
                            </Button>
                        </div>
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
                            className="shadow-sm"
                        >
                            {/* Mobile tab indicator - only shown on mobile */}
                            <div className="bg-slate-700 text-slate-200 rounded-md flex items-center justify-center gap-2 lg:hidden py-1">
                                {tabItems.find((tab) => tab.value === activeTab)?.icon}
                                <h2 className="text-xl font-semibold">
                                    {tabItems.find((tab) => tab.value === activeTab)?.label}
                                </h2>
                            </div>

                            {tabItems.find((tab) => tab.value === activeTab)?.component}
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
                            <Tag className="w-6 h-6 text-white" />
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
        </div >
    );
}