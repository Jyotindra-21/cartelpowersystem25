"use client"
import React from 'react'
import Title from '../title'
import { IOurStorySection } from '@/schemas/settingsSchema'
import { motion } from "framer-motion"
import { DynamicIcon } from '@/components/custom/DynamicIcon'
import Link from 'next/link'

interface AboutPageProps {
    ourStory?: IOurStorySection
}
const OurStoryPage = ({ ourStory }: AboutPageProps) => {
    return (
        <>
            <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
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
                                    <span className="inline-block text-xs font-medium text-green-600 uppercase tracking-wider border border-green-600 rounded-full pl-7 pr-4 py-1 mb-3 relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-600 rounded-full"></span>
                                        Our Story
                                    </span>
                                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                        {/* Leading Automatic Rescue Device in the Industry */}
                                        {ourStory?.titleDesc}
                                        {/* From a bold idea to a global force in smart energy solutions. */}
                                    </h2>
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


                                <div className="mt-8 pt-4">
                                    <Link
                                        href="/about-us/board-of-directors"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-secondary transition-all"
                                    >
                                        View all Team
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white">
                <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9 }}
                    >
                        <Title title="Stats & Mission" />

                    </motion.div>
                    {/* Company Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-16 ">
                        {ourStory?.companyStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center bg-white/5 backdrop-blur-sm border border-white/10 animate-float"
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
        </>
    )
}

export default OurStoryPage