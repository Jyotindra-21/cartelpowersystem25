"use client";
// import { CustomDialog } from '@/components/modals/CustomDialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Bolt, Shield, HardHat, Download, Check, Phone, Share2Icon, HeartIcon, Loader2, Play, LinkIcon, MailIcon, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicIcon } from '@/components/custom/DynamicIcon';
import { IProduct } from '@/schemas/productsSchema';
import Image from 'next/image';
import { useToast } from '@/components/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatIndianCurrency } from '@/lib/helper';

const ProductIdPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<'idle' | 'loading' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const { toast } = useToast()
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products/${slug}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data?.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Image Gallery Skeleton */}
                        <div className="lg:w-1/2">
                            <Skeleton className="h-[500px] w-full rounded-xl" />
                        </div>

                        {/* Product Details Skeleton */}
                        <div className="lg:w-1/2 space-y-6">
                            <Skeleton className="h-10 w-3/4" />
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-4 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-medium mb-4">Product not found</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link href="/products" className="text-blue-600 hover:underline">
                        Browse all products
                    </Link>
                </div>
            </div>
        );
    }
    if (product) {
        // 2. Add to beginning
        (product?.media?.images || []).unshift({
            url: product?.media?.mainImage,
            altText: product?.basicInfo?.slug,
            caption: product?.basicInfo?.name
        });
    }

    const handleDownloadFile = async (filename: string) => {
        try {
            if (!filename || downloading !== 'idle') return;
            setDownloading('loading')
            const response = await fetch(`/api/upload/view`, {
                method: 'POST',
                body: JSON.stringify({ filename: filename })
            });
            if (!response.ok) throw new Error('Failed to get file URL');
            const { url } = await response.json();
            // Fetch the file from S3 as blob
            const fileResponse = await fetch(url);
            if (!fileResponse.ok) throw new Error('Failed to download file');
            const blob = await fileResponse.blob();
            // Create a blob URL and trigger download
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = "installation_guide"; // This forces download
            document.body.appendChild(a);
            a.click();
            // Clean up
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
            setDownloading('success');
            setTimeout(() => setDownloading('idle'), 2000);
        } catch (err) {
            console.log(`Error: ${err}`);
            toast({
                title: "Error",
                description: "Failed to download file",
                variant: "destructive"
            });
            setDownloading('idle');
        }
    };

    const getButtonContent = () => {
        switch (downloading) {
            case 'loading':
                return {
                    icon: <Loader2 className="h-4 w-4 animate-spin" />,
                    text: 'Downloading...',
                    className: 'bg-blue-50 border-blue-200 text-blue-700'
                };
            case 'success':
                return {
                    icon: <Check className="h-4 w-4" />,
                    text: 'Downloaded!',
                    className: 'bg-green-50 border-green-200 text-green-700'
                };
            default:
                return {
                    icon: <Download className="h-4 w-4" />,
                    text: 'Installation Guide',
                    className: 'bg-transparent hover:bg-neutral-50'
                };
        }
    };

    const content = getButtonContent();

    const shareData = {
        title: product?.basicInfo.name || 'Product Details',
        text: `Check out ${product?.basicInfo.name}`,
        url: window.location.href,
    };

    const shareOptions = [
        {
            name: 'Copy Link',
            icon: LinkIcon,
            action: async () => {
                await navigator.clipboard.writeText(shareData.url);
                toast({ title: "Link copied!", variant: "default" });
                setShowShareOptions(false);
            }
        },
        {
            name: 'Email',
            icon: MailIcon,
            action: () => {
                const subject = `Check out ${shareData.title}`;
                const body = `${shareData.text}\n\n${shareData.url}`;
                window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                setShowShareOptions(false);
            }
        },
        {
            name: 'Facebook',
            icon: Facebook,
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`);
                setShowShareOptions(false);
            }
        },
        {
            name: 'Twitter',
            icon: Twitter,
            action: () => {
                const text = `Check out ${shareData.title}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.url)}`);
                setShowShareOptions(false);
            }
        }
    ];
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Share canceled');
            }
        } else {
            setShowShareOptions(true);
        }
    };

    return (
        <div className="bg-gray-50">
            {/* Minimal Hero Section */}
            <div className="bg-gradient-to-tl to-black/90 from-primary py-8 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-2 text-sm text-secondary/90 mb-2">
                        <Link href="/product" className="hover:text-blue-600">Products</Link>
                        <span>/</span>
                        <span>{product?.basicInfo?.brand}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">{product?.basicInfo.name}</h1>
                </div>
            </div>

            {/* Main Content - Split Screen Layout */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col justify-center lg:flex-row gap-8">
                    {/* Image Gallery - Sticky on scroll */}
                    <div className="lg:w-[45%] xl:w-[40%] lg:sticky lg:top-4 lg:self-start">
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <Carousel className="w-full max-w-[500px] mx-auto">
                                <CarouselContent>
                                    {product?.media?.images?.length ? (
                                        product?.media?.images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="relative aspect-square">
                                                    <Image
                                                        unoptimized
                                                        src={image.url || ""}
                                                        alt={image.altText || product?.basicInfo.name}
                                                        fill
                                                        className="object-contain p-4"
                                                        quality={100}
                                                        priority
                                                        sizes="(max-width: 1024px) 100vw, 500px"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))
                                    ) : (
                                        <CarouselItem>
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={product?.media?.mainImage || ""}
                                                    alt={product?.basicInfo.name}
                                                    fill
                                                    className="object-contain p-4"
                                                    quality={100}
                                                    priority
                                                    sizes="(max-width: 1024px) 100vw, 500px"
                                                />
                                            </div>
                                        </CarouselItem>
                                    )}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                            </Carousel>

                            {/* Quick Actions */}
                            <div className="flex justify-between mt-4">
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={handleNativeShare}
                                    >
                                        <Share2Icon className="h-4 w-4" />
                                        Share
                                    </Button>

                                    {showShareOptions && (
                                        <>
                                            {/* Backdrop */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowShareOptions(false)}
                                            />

                                            {/* Share options dropdown */}
                                            <div className="absolute top-full right-0 mt-2 z-50 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                                                {shareOptions.map((option) => (
                                                    <button
                                                        key={option.name}
                                                        onClick={option.action}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <option.icon className="h-4 w-4" />
                                                        {option.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* <Button variant="outline" size="sm" className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Brochure
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <HeartIcon className="h-4 w-4" />
                                    Save
                                </Button> */}
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:w-[45%] xl:w-[40%] space-y-6">
                        {/* Price Block */}
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatIndianCurrency(product?.pricing?.price)}
                                </span>
                                {product?.pricing?.hasDiscount && product?.pricing?.oldPrice && (
                                    <span className="text-lg line-through text-gray-500">
                                        {formatIndianCurrency(product?.pricing?.oldPrice)}
                                    </span>
                                )}
                                {product?.pricing?.hasDiscount && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                                        {product?.pricing?.discountPercentage}% OFF
                                    </span>
                                )}
                            </div>

                            <div className="mt-2 text-sm text-gray-600"> {product?.pricing?.taxIncluded ? "Inclusive" : "Exclusive"} of taxes</div>

                        </div>

                        {/* Key Highlights */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Key Highlights</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product?.featuresSection?.keyFeatures?.slice(0, 4).map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Benefits Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {product?.featuresSection?.benefits?.map((benefit, index) => (
                                <div key={index} className="bg-white border rounded-lg p-3 flex items-start gap-3">
                                    <div className="bg-blue-50 p-2 rounded-full">
                                        {<DynamicIcon iconName={benefit.icon} className={`text-${benefit?.color || "blue"}-500`} />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{benefit.title}</h4>
                                        <p className="text-sm text-gray-600">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="gap-4 flex space-y-3">
                            <Button size="sm" variant="primary" className="w-full bg-green-500 gap-2">
                                <Phone className="h-5 w-5" />
                                Call to Order
                            </Button>
                            <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        className="w-full"
                                        size="sm"
                                    >
                                        <Play className="h-5 w-5" />
                                        Watch Demo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="mx-auto">
                                    <DialogHeader className="px-1 sm:px-0">
                                        <DialogTitle className="text-lg sm:text-xl">Watch Demo</DialogTitle>
                                    </DialogHeader>
                                    <div className="px-1 sm:px-0">
                                        <iframe
                                            className="aspect-video w-full h-full rounded-lg"
                                            src={product?.media?.videoUrl}
                                            title="Product demo"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {/* <CustomDialog
                                title="Product Demonstration"
                                triggerLabel={
                                    <Button variant="outline" size="lg" className="w-full gap-2">
                                        <Play className="h-5 w-5" />
                                        Watch Demo
                                    </Button>
                                }
                            >
                                <div className="aspect-video">
                                    <iframe
                                        className="w-full h-full rounded-lg"
                                        src={product?.media?.videoUrl}
                                        title="Product demo"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </CustomDialog> */}
                        </div>

                        {/* Quick Specs */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-medium mb-3">Quick Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {product?.featuresSection?.specifications?.slice(0, 4).map((spec, index) => (
                                    <div key={index} className="flex justify-between py-2 bg-primary/10 px-2 rounded-sm  border-b border-gray-100 last:border-0">
                                        <span className="text-gray-500">{spec.label}</span>
                                        <span className="font-medium text-right">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="mt-12 space-y-12">
                    {/* Full Specifications */}
                    <section className="bg-white rounded-lg border p-4">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Bolt className="h-4 w-4 text-blue-500" />
                            Technical Specifications
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {product?.featuresSection?.specifications?.map((spec, index) => (
                                <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-gray-500">{spec.label}</span>
                                    <span className="font-medium text-right">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Features */}
                    <section className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-2xl font-bold mb-6">Product Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product?.featuresSection?.keyFeatures?.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                        <Check className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <p>{feature}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Support Section */}
                    <section className="bg-blue-50 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-6">Support & Installation</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <HardHat className="h-5 w-5 text-blue-600" />
                                    Professional Installation
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Our certified technicians ensure proper installation for optimal performance.
                                </p>
                                <Button onClick={() => handleDownloadFile(product?.resources?.installationGuideUrl || "")} className={`inline-flex items-center justify-center  whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-neutral-300    [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer border border-neutral-300 bg-transparent hover:bg-neutral-50 shadow-sm text-neutral-700 gap-2 p-2 ${content.className}`} >
                                    {content.icon}
                                    {content.text}
                                </Button>
                            </div>
                            <div>
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    Warranty & Support
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    {product?.warranty?.warranty} warranty with {product?.warranty?.supportInfo}.
                                </p>
                                {/* <Button variant="outline" className="gap-2">
                                    Warranty Details
                                </Button> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProductIdPage;