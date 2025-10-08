"use client"
import React from 'react'
import Title from '../title'
import { IOurStorySection } from '@/schemas/settingsSchema'
import { motion } from "framer-motion"
import { DynamicIcon } from '@/components/custom/DynamicIcon'
import { slideUp, staggerContainer } from '@/lib/animations'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ITestimonial } from '@/schemas/testimonialSchema'

interface AboutPageProps {
    ourStory?: IOurStorySection
    testimonials?: ITestimonial[] | null
}
const OurStoryPage = ({ ourStory, testimonials }: AboutPageProps) => {
    return (
        <>
            <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9 }}
                >
                    <Title title="Our Story" />
                </motion.div>
                <h6 className="text-lg text-center font-bold text-gray-900 mb-6">
                    {/* Leading Automatic Rescue Device in the Industry */}
                    {ourStory?.titleDesc}
                    {/* From a bold idea to a global force in smart energy solutions. */}
                </h6>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Column - Image with Spinner */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="w-full lg:w-1/2 mb-10 lg:mb-0" >
                            <div className="relative">
                                <div className="flex justify-end">
                                    <img
                                        src={ourStory?.image}
                                        className="rounded-tl-[50px] rounded-tr-[50px] rounded-br-[400px] rounded-bl-[400px] max-w-full h-auto"
                                        alt="Solar panel installation"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column - Content */}
                        <motion.div className="w-full lg:w-1/2 lg:pl-12"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }} >
                            <div className="py-8 lg:py-0">
                                <div className="mb-8">

                                    <div className='text-lg text-gray-700 mb-4 first-letter:text-4xl first-letter:font-bold first-letter:text-gray-900 first-letter:float-left first-letter:mr-2' dangerouslySetInnerHTML={{ __html: ourStory?.description.replace(/className=/g, 'class=') || "" }} />

                                </div>
                                <motion.div
                                    className="z-10 border-l-4 border-teal-400 pl-5 py-3 bg-gray-800/70 rounded-r-lg shadow-md"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h5 className="text-lg font-bold text-white">{ourStory?.storyTeller}</h5>
                                    <p className="text-teal-400 font-medium">{ourStory?.position}</p>
                                    <p className="text-gray-300 mt-1">
                                        {ourStory?.quote}
                                    </p>
                                </motion.div>

                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9 }}
            >
                <Title title="Company Stats" />
            </motion.div>
            <div className="bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white">
                <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    {/* Company Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        {ourStory?.companyStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className=" p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center bg-white/5 backdrop-blur-sm border border-white/10 animate-float liquid-glass"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.06 }}
                            >
                                <div className="flex justify-center mb-3">
                                    <div className="p-2 rounded-full bg-black/80">
                                        {<DynamicIcon iconName={stat.icon || "Zap"} className={stat.color} />}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-1">{stat.value}</h3>
                                <p className="text-white text-sm">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
            {ourStory?.isMissionView && (
                <div className=" text-white">
                    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.9 }}
                        >
                            <Title title="Our Mission" />
                        </motion.div>
                        {/* Mission Statement */}

                        {ourStory?.isMissionView && (
                            <motion.div
                                className="bg-gradient-to-r from-primary to-black/90 rounded-xl p-10 text-center"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7 }}
                                dangerouslySetInnerHTML={{ __html: ourStory?.missionDescription || "" }}
                            />
                        )}
                    </div>
                </div>
            )}


            {/* TESTIMONIALS */}

            {testimonials && testimonials?.length > 0 && (
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
            )}
        </>
    )
}

export default OurStoryPage