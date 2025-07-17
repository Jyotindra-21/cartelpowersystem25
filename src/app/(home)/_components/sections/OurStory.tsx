"use client"
import React from 'react'
import Title from '../title'
import { IOurStorySection } from '@/schemas/settingsSchema'
import { motion } from "framer-motion"
import { DynamicIcon } from '@/components/custom/DynamicIcon'

interface AboutPageProps {
    ourStory?: IOurStorySection
}


const OurStoryPage = ({ ourStory }: AboutPageProps) => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white">
            <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9 }}
                >
                    <Title title="Our Story" />
                    <motion.p
                        className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >{ourStory?.titleDesc}
                    </motion.p>
                </motion.div>

                {/* Founder Story */}
                <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-blue-900/30 rounded-xl -z-10"></div>
                        <img
                            src={ourStory?.image || ""}
                            alt="Cartel Team"
                            className="w-full h-auto rounded-xl shadow-lg"
                        />
                    </motion.div>

                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="text-justify relative" >
                            <span className="absolute -left-8 -top-3 text-7xl font-bold text-teal-800/50 -z-10 select-none"></span>
                            <div dangerouslySetInnerHTML={{ __html: ourStory?.description.replace(/className=/g, 'class=') || "" }} />

                            {/* {ourStory?.description} */}

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
                    </motion.div>
                </div>

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
                    >
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-base text-gray-100 max-w-3xl mx-auto leading-relaxed">
                            {ourStory?.missionDescription}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default OurStoryPage