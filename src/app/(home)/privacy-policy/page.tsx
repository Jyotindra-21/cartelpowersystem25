'use client';

import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { fadeIn, staggerContainer, slideInFromLeft, slideInFromRight } from '@/lib/animations';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
            >
                {/* Header with Shield Icon */}
                <motion.div
                    variants={fadeIn}
                    className="bg-gradient-to-r from-primary to-black/90 p-8 text-center"
                >
                    <div className="flex justify-center mb-4">
                        <Shield className="text-secondary text-5xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    <p className="mt-2 text-blue-100">Last Updated: June 28, 2023</p>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    variants={fadeIn}
                    className="p-8 md:p-10"
                >
                    {/* Section 1: Introduction */}
                    <motion.section
                        variants={slideInFromLeft}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to <strong>Cartel Power System</strong> {`("we," "our," or "us"). We are committed to protecting
                            your privacy and ensuring the security of your personal data. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you
                            interact with our website, products, or services related to the sale and manufacturing`}
                            of <strong>ARD (Automatic Rescue Device) for lifts</strong>.
                        </p>
                    </motion.section>

                    {/* Section 2: Information We Collect */}
                    <motion.section
                        variants={slideInFromRight}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            We may collect the following types of information:
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 className="font-medium text-blue-700 mb-2">Personal Information</h3>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                <li>Name, email address, phone number, and company details</li>
                                <li>Billing and shipping details (for purchases)</li>
                                <li>Technical and usage data (IP address, browser type)</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-2">Non-Personal Information</h3>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                <li>Anonymous usage statistics</li>
                                <li>Cookies and tracking technologies</li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Section 3: How We Use Your Information */}
                    <motion.section
                        variants={slideInFromLeft}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We use the collected data for:
                        </p>
                        <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
                            <li>Processing orders and providing customer support</li>
                            <li>Improving our products and services</li>
                            <li>Sending marketing communications (with your consent)</li>
                            <li>Complying with legal obligations</li>
                        </ul>
                    </motion.section>

                    {/* Section 4: Data Security */}
                    <motion.section
                        variants={slideInFromRight}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We implement <strong>industry-standard security measures</strong> (encryption, access controls)
                            to protect your data from unauthorized access or breaches.
                        </p>
                    </motion.section>

                    {/* Contact Section */}
                    <motion.section
                        variants={fadeIn}
                        className="mt-12 bg-gray-50 p-6 rounded-xl"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Mail className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-gray-700">Email</h3>
                                    <p className="text-gray-600">privacy@cartelpowersystem.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Phone className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-gray-700">Phone</h3>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-gray-700">Address</h3>
                                    <p className="text-gray-600">123 Industrial Park, Lift City, LC 12345</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </motion.div>
            </motion.div>
        </div>
    );
}