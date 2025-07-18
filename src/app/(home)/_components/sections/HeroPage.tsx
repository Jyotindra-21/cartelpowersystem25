"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Link from 'next/link'
import { IFeatures, IHeroSection } from '@/schemas/settingsSchema'
import { IProduct } from '@/schemas/productsSchema'
import FloatingFeature from '@/components/custom/FloatingFeatures'
import Image from 'next/image'


interface HeroPageProps {
    heroSection?: IHeroSection
    banners?: IProduct[]
}
const HeroPage = ({ heroSection, banners }: HeroPageProps) => {
    return (
        <section className='min-h-[100vh] w-full bg-gradient-to-br from-primary via-primary-dark to-primary-darker flex px-4 overflow-hidden relative'>
            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>

                {/* Carefully positioned floating features */}
                {heroSection?.floatingFeature.map((feature, index) => {
                    return (
                        <FloatingFeature
                            key={index}
                            icon={feature.icon}
                            label={feature.label}
                            position={feature.position}
                            delay={`${index * 0.3}s`}
                        />
                    )
                }

                )}
            </div>
            {/* Main grid container with visible lines */}
            <div className='grid grid-cols-1 md:grid-cols-2 w-full max-w-[1200px] mx-auto relative z-10 py-12 md:py-20 gap-8 md:gap-12'>
                {/* Left Column with right border */}
                <div className="relative flex m-auto">
                    <div className='flex flex-col justify-center z-10 gap-6 w-full'>
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full w-fit">
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                            <span className="text-white/80 text-sm">{heroSection?.head}</span>
                        </div>

                        <h1 className='text-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight'>
                            <span className="text-secondary">{heroSection?.title?.split(" ")?.[0]}</span> {heroSection?.title?.split(" ")?.[1]}<br />
                            <span className="bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent">
                                {heroSection?.title?.split(" ")?.[2]}{heroSection?.title?.split(" ")?.[3]}
                            </span>
                        </h1>

                        <p className="text-white/80 text-lg max-w-lg leading-relaxed">
                            {heroSection?.description}
                        </p>

                        <div className='flex flex-wrap gap-4 mt-2'>
                            <Button
                                className='px-8 py-6 text-lg bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transition-transform  duration-1000 shadow-lg'
                            >
                                View Product Line
                            </Button>
                            {/* <Button
                                variant="outline"
                                className='px-8 py-6 text-lg border-white/30 hover:bg-white/10 hover:border-white/50 transition-all'
                            >
                                Technical Specifications
                                <ArrowDownToLine className='ml-2' />
                            </Button> */}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 max-w-md">
                            {heroSection?.features.map((feature: IFeatures, index: number) => (
                                <div key={index} className="bg-gradient-to-r from-primary to-black/10 backdrop-blur-sm border border-gray-300/80 rounded-lg px-3 py-1 shadow-lg w-auto flex gap-2 items-center">
                                    <div className="w-2 h-2  bg-secondary rounded-full"></div>
                                    <span className="text-white/80">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:50px_52px] [mask-image:radial-gradient(ellipse_60%_67%_at_50%_60%,#000_70%,transparent_100%)]">
                    </div>
                </div>

                {/* Right Column with left border indicator */}
                <div className='relative order-1 md:order-2'>
                    <div className="relative h-full min-h-[300px] sm:min-h-[400px]">
                        <div className="absolute -inset-8 bg-gradient-to-br from-secondary/10 to-primary/20 rounded-3xl blur-xl opacity-60 z-0"></div>
                        {banners && banners?.length > 0 ? <Carousel
                            className="w-full h-full flex justify-center items-center relative z-20"
                            opts={{
                                align: "center",
                                loop: true
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 4000,
                                }),
                            ]}
                        >
                            <CarouselContent>
                                {banners.map((item, index) => (
                                    <CarouselItem key={index} >
                                        <Link href={`/product/${item?.basicInfo.slug}`}>
                                            <div className="flex flex-col items-center p-4 h-full">
                                                <div className="relative bg-gradient-to-t from-black/5 hover:from-black/20 transition-transform duration-1000 to-transparent w-full h-full max-w-lg  group">
                                                    <img
                                                        // height={600}
                                                        // width={600}
                                                        src={item?.media && item?.media.mainImage || ""}
                                                        className="w-full h-auto object-contain rounded-xl shadow-2xl border border-white/10 transition-transform "
                                                        alt={item?.basicInfo.slug || ""}
                                                    />
                                                    {item?.flags && item?.flags.isNewProduct ? (<div className="absolute -top-3 -left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-30 flex items-center">

                                                        NEW
                                                    </div>) : ""}


                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl z-20">
                                                        <div className="flex flex-wrap gap-2">

                                                            {item?.tags?.tags?.map((tag: string, index: number) => (
                                                                <div key={index} className={`${item.tags?.tags?.length === index + 1 ? "bg-secondary/90" : "bg-white/10"}  backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white`}>
                                                                    {tag}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <h3 className="mt-2 text-white font-bold text-xl drop-shadow-md">
                                                            {item?.basicInfo.name.split(' ')[0]} {/* Shows just first word */}
                                                            <span className="text-secondary ml-1">
                                                                {item?.basicInfo.name.split(' ').slice(1).join(' ')}
                                                            </span>
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel> : "No Banner Found"
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroPage