import React from 'react'
import { Mail, Phone, MapPin, Check } from 'lucide-react';
import { ContactForm } from '../_components/contact-form';
import { fetchFooterSection } from '@/services/settings.services';
import { IApiResponse } from '@/types/ApiResponse';
import { IFooterSection } from '@/schemas/settingsSchema';
import CommonBanner from '../_components/common-banner';
export const dynamic = 'force-dynamic';

const Contact = async () => {
  const [footerRes] = await Promise.all([
    fetchFooterSection() as Promise<IApiResponse<IFooterSection>>,
  ]);
  const { data: footerSection } = footerRes;

  return (
    <section className="relative  bg-gradient-to-b from-blue-50 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* Modern Hero Section */}
      <CommonBanner title='Contact' highlightedText='Our Team' description='Have questions about our product ? Reach out to our experts today.' buttonText='Explore Product' buttonLink='/product' />
      <div className="container py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-1">Email</h4>
                    <p className="text-lg text-gray-800">{footerSection?.contactDetails?.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-1">Phone</h4>
                    <p className="text-lg text-gray-800">{footerSection?.contactDetails?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-1">Address</h4>
                    <p className="text-lg text-gray-800">{footerSection?.contactDetails?.address}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Why Contact Us */}
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Why Contact Us?</h3>
              <ul className="space-y-3">
                {footerSection?.whyContactUs?.map((item, index) => (
                  <li className="flex items-start" key={index}>
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item?.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Contact