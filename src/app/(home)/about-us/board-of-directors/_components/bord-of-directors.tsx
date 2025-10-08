"use client"
import React from 'react'
import { Bolt, Briefcase, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations'
import { ITeamMember } from '@/schemas/teamMemberSchema'
import { IOurStorySection } from '@/schemas/settingsSchema'
import Title from '@/app/(home)/_components/title'
export const dynamic = 'force-dynamic';

interface BoardOfDirectorsProps {
    data: IOurStorySection | null
    teamMembers: ITeamMember[] | []

}
const BoardOfDirectors = ({ data, teamMembers }: BoardOfDirectorsProps) => {

    return (
        <div className="bg-gray-50">
            {/* Modern Hero Section */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24"
            >

                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:50px_52px] [mask-image:radial-gradient(ellipse_41%_45%_at_39%_56%,#000_35%,transparent_100%)]">
                </div>
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <motion.div
                            variants={slideUp}
                            className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                        >
                            <span className="flex items-center text-sm font-medium">
                                <Bolt className="h-4 w-4 mr-2" /> Leadership Excellence
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={slideUp}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        >
                            Visionary <span className="text-yellow-300">Leadership Team</span>
                        </motion.h1>

                        <motion.p
                            variants={slideUp}
                            className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl"
                        >
                            Meet the executive team driving Cartel Power System&apos;s innovation in elevator safety technology
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
            {/* Executive Team Section */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <Title title='EXECUTIVE TEAM' />
                    <motion.h6 variants={slideUp} className="text-lg text-center font-bold text-gray-900 mb-6">
                        Seasoned professionals with decades of combined experience in elevator safety technology
                    </motion.h6>
                    
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                >
                    {teamMembers && teamMembers?.map((director, index) => (
                        <motion.div
                            key={index}
                            variants={slideUp}
                            whileHover={{ y: -10 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-2xl">
                                <div className="relative h-80 overflow-hidden">
                                    <Image
                                        unoptimized
                                        src={director.image}
                                        alt={director.fullName}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <h3 className="text-2xl font-bold text-white">{director.fullName}</h3>
                                        <p className="text-blue-300 font-medium">{director.designation}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-6">{director.description}</p>
                                    <div className="border-t border-gray-100 pt-4">
                                        <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            AREAS OF EXPERTISE
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {director.expertise?.split(",")?.map((item, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full flex items-center"
                                                >
                                                    <Bolt className="h-3 w-3 mr-1" />
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                {/* Mission Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden mb-20"
                >
                    <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                    {data?.isMissionView && (
                        <motion.div
                            className="bg-gradient-to-r from-primary to-black/40 backdrop-blur-sm p-12 text-white relative text-center"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                            dangerouslySetInnerHTML={{ __html: data?.missionDescription || "" }}
                        />
                    )}
                </motion.div>


            </section>
        </div>
    )
}

export default BoardOfDirectors