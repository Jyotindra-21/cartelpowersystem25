"use client"
import React from 'react'
import { Bolt, Award, Briefcase, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const BoardOfDirectors = () => {
  const directors = [
    {
      name: "John Doe",
      position: "Chairman & CEO",
      bio: "With over 20 years in lift technology, John leads our vision for innovative safety solutions.",
      expertise: ["Lift Safety", "Strategic Leadership", "Global Expansion"],
      image: "/assets/ceoimg.png"
    },
    {
      name: "Jane Smith",
      position: "Chief Technology Officer",
      bio: "Jane oversees the development of our two-color ARD systems, ensuring reliability and style.",
      expertise: ["Product Innovation", "R&D", "Technical Standards"],
      image: "/assets/ceoimg.png"
    },
    {
      name: "Michael Lee",
      position: "Chief Financial Officer",
      bio: "Michael drives our financial strategy to support global ARD distribution.",
      expertise: ["Financial Strategy", "Investor Relations", "Market Growth"],
      image: "/assets/ceoimg.png"
    }
  ]

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

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
          <motion.h2
            variants={slideUp}
            className="text-2xl font-semibold text-blue-700 mb-4"
          >
            EXECUTIVE TEAM
          </motion.h2>
          <motion.h3
            variants={slideUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Our <span className="text-blue-600">Strategic Leaders</span>
          </motion.h3>
          <motion.p
            variants={slideUp}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Seasoned professionals with decades of combined experience in elevator safety technology
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {directors.map((director, index) => (
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
                    alt={director.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white">{director.name}</h3>
                    <p className="text-blue-300 font-medium">{director.position}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{director.bio}</p>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      AREAS OF EXPERTISE
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {director.expertise.map((item, i) => (
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
          <div className="bg-gradient-to-r from-primary to-black/40 backdrop-blur-sm p-12 text-white relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="inline-block mb-6"
              >
                <Award className="h-12 w-12 text-secondary" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-6">Our Leadership Mission</h2>
              <p className="text-lg leading-relaxed">
                To revolutionize elevator safety worldwide through innovative Automatic Rescue Devices that combine
                cutting-edge technology with distinctive design. Our executive team is committed to delivering
                solutions that don&apos;t just meet industry standards, but redefine them.
              </p>
            </div>
          </div>
        </motion.div>


      </section>
    </div>
  )
}

export default BoardOfDirectors