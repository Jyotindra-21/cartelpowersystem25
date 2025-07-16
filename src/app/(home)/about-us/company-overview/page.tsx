"use client"
import React from 'react';
import { Bolt, Award, Globe, HardHat, ChevronRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const CompanyOverview: React.FC = () => {
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
          {[
            { value: "20+", label: "Countries", color: "text-yellow-400" },
            { value: "10K+", label: "Installations", color: "text-blue-400" },
            { value: "100%", label: "Safety Record", color: "text-green-400" },
            { value: "24/7", label: "Global Support", color: "text-purple-400" }
          ].map((stat, index) => (
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

      {/* About Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-200">
              {/* Placeholder for image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400">Company Facility Image</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">OUR MISSION</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Elevating Safety Through Innovation
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 2010, Cartel Power System has revolutionized elevator safety with our patented Automatic Rescue Devices. Our silver and blue ARD units combine German engineering precision with elegant design, delivering unmatched reliability.
            </p>

            <div className="space-y-4">
              {[
                { icon: Globe, title: "Global Standards", text: "Certified for international markets" },
                { icon: Award, title: "Award-Winning", text: "Recognized for technical excellence" },
                { icon: HardHat, title: "Industrial Grade", text: "Built for demanding environments" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={slideUp} className="text-2xl font-semibold text-blue-800 mb-4">
            TRUSTED BY INDUSTRY LEADERS
          </motion.h2>
          <motion.h3 variants={slideUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Our Partners Say
          </motion.h3>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {[
                {
                  quote: "Cartel's ARD system has become our standard for all new installations. The reliability is unmatched.",
                  author: "Michael Chen",
                  position: "CTO, Skyline Elevators",
                  border: "border-yellow-400"
                },
                {
                  quote: "In 10 years of using Cartel products, we've never had a single failure during an emergency.",
                  author: "Sarah Johnson",
                  position: "Safety Director, Urban Properties",
                  border: "border-blue-400"
                },
                {
                  quote: "The technical support team at Cartel is exceptional. They respond immediately to any queries.",
                  author: "David Müller",
                  position: "Engineering Manager, EuroLifts",
                  border: "border-green-400"
                },
                {
                  quote: "We've reduced our maintenance costs by 30% after switching to Cartel's safety systems.",
                  author: "Lisa Rodriguez",
                  position: "Operations Director, Metro Buildings",
                  border: "border-purple-400"
                }
              ].map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`bg-white p-8 rounded-xl shadow-md border-t-4 ${testimonial.border} h-full`}
                  >
                    <div className="text-gray-600 mb-6 text-lg leading-relaxed">{testimonial.quote}</div>
                    <div className="flex items-center">
                      <div className="bg-gray-200 w-12 h-12 rounded-full mr-4"></div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.author}</div>
                        <div className="text-gray-500 text-sm">{testimonial.position}</div>
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

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Safety Standards?</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
            Contact our team to discuss your requirements and get a customized solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold rounded-lg transition-all">
              Get a Quote
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CompanyOverview;