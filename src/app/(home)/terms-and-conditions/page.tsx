'use client';

import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ShoppingCart, Mail, Phone, MapPin, Shield, PenTool } from 'lucide-react';
import { fadeIn, staggerContainer, slideInFromLeft, slideInFromRight } from '@/lib/animations';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Header */}
        <motion.div 
          variants={fadeIn}
          className="bg-gradient-to-r from-primary to-black/90 p-8 text-center"
        >
          <div className="flex justify-center mb-4">
            <FileText className="text-secondary white w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-white">Terms &amp; Conditions</h1>
          <p className="mt-2 text-blue-100">Effective Date: June 28, 2023</p>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          variants={fadeIn}
          className="p-8 md:p-10"
        >
          {/* Introduction */}
          <motion.section 
            variants={slideInFromLeft}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="text-blue-600 w-5 h-5" />
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to <strong>Cartel Power System</strong> {`("Company", "we", "us", or "our"). These Terms &amp; Conditions 
              govern your use of our website and the purchase of our ARD (Automatic Rescue Device) for lifts. 
              By accessing or using our services, you agree to be bound by these terms.`}
            </p>
          </motion.section>

          {/* Products */}
          <motion.section 
            variants={slideInFromRight}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PenTool className="text-blue-600 w-5 h-5" />
              2. Products & Services
            </h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>All ARD devices are manufactured to industry standards</li>
              <li>Product specifications may change without notice</li>
              <li>We reserve the right to limit quantities</li>
            </ul>
          </motion.section>

          {/* Orders */}
          <motion.section 
            variants={slideInFromLeft}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCart className="text-blue-600 w-5 h-5" />
              3. Ordering Process
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                All orders are subject to product availability. We may refuse any order for any reason.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Pricing</h3>
                <p className="text-gray-600">
                  Prices are subject to change without notice. We are not responsible for typographical errors.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Warranty */}
          <motion.section 
            variants={slideInFromRight}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="text-blue-600 w-5 h-5" />
              4. Warranty & Liability
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Limited Warranty</h3>
              <p className="text-gray-600 mb-3">
                Our products come with a 12-month limited warranty covering manufacturing defects.
              </p>
              <h3 className="font-medium text-gray-700 mb-2">Limitation of Liability</h3>
              <p className="text-gray-600">
                Cartel Power System shall not be liable for any indirect, incidental, or consequential damages.
              </p>
            </div>
          </motion.section>

          {/* Intellectual Property */}
          <motion.section 
            variants={slideInFromLeft}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="text-blue-600 w-5 h-5" />
              5. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on our website, including logos, designs, and product specifications, are our exclusive property.
            </p>
          </motion.section>

          {/* Governing Law */}
          <motion.section 
            variants={slideInFromRight}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-blue-600 w-5 h-5" />
              6. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These terms shall be governed by the laws of [Your Country/State] without regard to conflict of law principles.
            </p>
          </motion.section>

          {/* Contact */}
          <motion.section 
            variants={fadeIn}
            className="mt-12 bg-gray-50 p-6 rounded-xl"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="text-blue-600 mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                <div>
                  <h3 className="font-medium text-gray-700">Email</h3>
                  <p className="text-gray-600">legal@cartelpowersystem.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="text-blue-600 mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                <div>
                  <h3 className="font-medium text-gray-700">Phone</h3>
                  <p className="text-gray-600">+1 (555) 987-6543</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="text-blue-600 mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                <div>
                  <h3 className="font-medium text-gray-700">Address</h3>
                  <p className="text-gray-600">123 Industrial Park, Lift City, LC 12345</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Acceptance */}
          <motion.div 
            variants={fadeIn}
            className="mt-8 p-4 bg-blue-50 rounded-lg text-center"
          >
            <p className="text-gray-700 font-medium">
              By using our website or purchasing our products, you acknowledge that you have read and agree to these Terms &amp; Conditions.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}