"use client"
import React from 'react';
import { Bolt, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { IOurStorySection } from '@/schemas/settingsSchema';
import { ITestimonial } from '@/schemas/testimonialSchema';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';
import Title from '@/app/(home)/_components/title';

interface CompanyOverviewProps {
    data: IOurStorySection | null,
    testimonials: ITestimonial[] | null
}

const CompanyOverview = ({ data, testimonials }: CompanyOverviewProps) => {

    return (
        <div className="bg-gray-50">
            {/* Modern Hero Section */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24"
            >

                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:50px_52px] [mask-image:radial-gradient(ellipse_41%_45%_at_39%_56%,#000_35%,transparent_100%)]"></div>
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <motion.div
                            variants={slideUp}
                            className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                        >
                            <span className="flex items-center text-sm font-medium">
                                <Bolt className="h-4 w-4 mr-2" /> Elevator Safety Innovators
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={slideUp}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        >
                            Redefining Elevator <span className="text-yellow-300">Safety Standards</span>
                        </motion.h1>

                        <motion.p
                            variants={slideUp}
                            className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl"
                        >
                            Cartel Power System delivers cutting-edge Automatic Rescue Devices trusted by industry leaders worldwide since 2010.
                        </motion.p>

                        <motion.div
                            variants={slideUp}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href="/product" className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold rounded-lg transition-all flex items-center z-10">
                                Explore Products <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Abstract wave pattern */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-[url('/images/wave-pattern.svg')] bg-cover opacity-20"></div>
            </motion.section>

            {/* Glassy Stats Bar */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="container mx-auto px-6 -mt-12 z-10 relative"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data?.companyStats?.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={slideUp}
                            className="bg-white/30 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg"
                        >
                            <div className={`text-3xl font-bold ${stat.color} mb-2 text-center`}>{stat.value}</div>
                            <div className=" font-medium text-black text-center">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Mission Statement */}
            <div className=" text-white py-20 px-6">

                {data?.isMissionView && (
                    <motion.div
                        className="bg-gradient-to-r from-primary to-black/90 rounded-xl p-10 text-center"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        dangerouslySetInnerHTML={{ __html: data?.missionDescription || "" }}
                    />
                )}
            </div>


            <section className="py-20 container mx-auto px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <Title title='TRUSTED BY INDUSTRY LEADERS' />
                    <h6 className="text-lg text-center font-bold text-gray-900 mb-6">
                        What Our Partners Say
                    </h6>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {testimonials?.map((testimonial, index) => (
                                <CarouselItem key={index} className="md:basis-1/2">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className={`bg-white p-8 rounded-xl shadow-md border-t-4 border-orange-500 h-full`}
                                    >
                                        <div className="text-gray-600 mb-6 text-lg leading-relaxed">{testimonial.description}</div>
                                        <div className="flex items-center">
                                            <div className="bg-gray-200 w-12 h-12 rounded-full mr-4 overflow-hidden">
                                                <img src={testimonial.image} alt="Testimonial Image" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{testimonial.fullName}</div>
                                                <div className="text-gray-500 text-sm">{testimonial.designation}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex" />
                        <CarouselNext className="hidden md:flex" />
                    </Carousel>
                </div>
            </section>

        </div>
    );
};

export default CompanyOverview;