import { DynamicIcon } from '@/components/custom/DynamicIcon';
import LogoReveal from '@/components/custom/LogoReveal';
import { ISvgLogo } from '@/schemas/logoSchema';
import { IFooterSection, IWebsiteInfo } from '@/schemas/settingsSchema';
import { fetchFooterSection, fetchWebsiteInfo } from '@/services/settings.services';
import { getActiveSvgLogo } from '@/services/svglogo.services';
import { IApiResponse } from '@/types/ApiResponse';
import { Zap, Contact, Microchip } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

const Footer = async () => {
    const [websiteInfoRes, svgLogo, footerRes] = await Promise.all([
        fetchWebsiteInfo() as Promise<IApiResponse<IWebsiteInfo>>,
        getActiveSvgLogo() as Promise<ISvgLogo>,
        fetchFooterSection() as Promise<IApiResponse<IFooterSection>>,
    ]);
    const { data: websiteInfo } = websiteInfoRes;
    const { data: footerSection } = footerRes;
    return (
        <footer className="relative bg-gradient-to-b from-primary to-black overflow-hidden">
            {/* Animated power wave effect */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary via-secondary to-primary opacity-20 animate-[pulseWave_3s_linear_infinite]" />

            <div className="relative z-10">
                {/* Main footer content */}
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company info */}
                        <div>
                            <div className="flex items-center">
                                <div
                                    className="drop-shadow-[1px_1px_2px_white] rounded-tl-2xl rounded-bl-2xl"

                                >
                                    {websiteInfo?.isSvg ? (
                                        <LogoReveal
                                            size={svgLogo?.svg?.size || 150}
                                            initialData={{
                                                viewBox: svgLogo?.svg.viewBox || "",
                                                paths: JSON.parse(svgLogo?.svg.paths || "[]"),
                                                animation: svgLogo?.svg.animation
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {websiteInfo?.logo ? (
                                                <Image
                                                    unoptimized
                                                    src={websiteInfo.logo}
                                                    alt="logo-image"
                                                    width={150}
                                                    height={200}
                                                />
                                            ) : (
                                                <h6 className='uppercase text-3xl'>
                                                    {websiteInfo?.metaTitle?.split(' ')?.[0] || ""}
                                                </h6>
                                            )}
                                        </>
                                    )}
                                </div>
                                {/* <Power className="text-secondary h-8 w-8" />
                                <span className="text-2xl font-bold text-white">Cartel Power System</span> */}
                            </div>

                            {websiteInfo?.tagLine && <p className="text-secondary tracking-[4px]  w-auto font-thin text-md mt-0 mb-6 ">
                                {websiteInfo?.tagLine}
                            </p>}

                            <div className="flex  space-x-4">
                                {footerSection?.socialMedia?.map((item, index) => (
                                    <Link key={index} href={`${item.url}`} className="text-gray-400 hover:text-secondary transition-colors">
                                        {<DynamicIcon iconName={item.icon || "Star"} className="h-6 w-6" />}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white flex items-center">
                                <Zap className="h-5 w-5 mr-2 text-secondary" />
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                {footerSection?.quickLinks?.map((item, index) => (
                                    <li key={index}>
                                        <Link href={`${item.link}`} className="text-gray-400 hover:text-white transition-colors">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ARD Technology */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white flex items-center">
                                <Microchip className="h-5 w-5 mr-2 text-secondary" />
                                Technology
                            </h3>
                            <ul className="space-y-2">
                                {footerSection?.technology?.map((item, index) => (
                                    <li key={index}>
                                        <Link href={`${item.fileUrl}`} className="text-gray-400 hover:text-white transition-colors">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white flex items-center">
                                <Contact className="h-5 w-5 mr-2 text-secondary" />
                                Contact Details
                            </h3>
                            <address className="text-gray-400 not-italic">
                                <p>{footerSection?.contactDetails?.address}</p>
                                {/* <p>Industrial Zone, Mumbai</p>
                                <p>Maharashtra 400001</p> */}
                                <p className="mt-2">Phone: {footerSection?.contactDetails?.phone}</p>
                                <p>Email: {footerSection?.contactDetails?.email}</p>
                            </address>
                        </div>
                    </div>

                    {/* Newsletter */}
                    {/* <div className='flex flex-wrap  items-end gap-2'> */}
                    <div className="mt-12 p-6 w-full  h-auto bg-white/5 backdrop-blur-sm border border-white/10  rounded-lg">
                        <div className="max-w-2xl mx-auto text-center">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Stay Powered With Our Updates
                            </h3>
                            <p className="text-gray-300 mb-4">
                                Subscribe to our newsletter for the latest in ARD technology and power solutions.
                            </p>
                            {/* <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                                <button className="px-6 py-2 bg-primary hover:bg-secondary rounded transition-colors text-white font-medium">
                                    Subscribe
                                </button>
                            </div> */}
                        </div>
                    </div>
                    {/* <div className="relative h-44 w-full md:w-[50%]  overflow-hidden shadow-xl bg-gray-100  border-2 border-red-300 rounded-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3203.4918427871635!2d72.68744946066737!3d23.038858321505764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87a3d28e0103%3A0xef1e76eea92cfd48!2sVersatile%20Industrial%20Estate!5e0!3m2!1sen!2sin!4v1751108307488!5m2!1sen!2sin"
                                className="absolute inset-0 w-full h-full"
                                loading="lazy"
                                allowFullScreen
                            />
                        </div> */}
                    {/* </div> */}
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 py-6">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} Cartel Power System. All Rights Reserved.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Terms &amp; Conditions
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}

export default Footer