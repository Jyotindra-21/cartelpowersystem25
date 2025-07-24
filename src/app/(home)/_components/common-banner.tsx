"use client"
import React from 'react'
import { motion } from "framer-motion"
import { IconType } from 'react-icons';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface CommonBannerProps {
    title: string;
    highlightedText?: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
    icon?: IconType | React.ComponentType<{ className?: string }>;
    iconText?: string;
    background?: string;
    highlightColor?: string;
    pattern?: boolean;
    animation?: boolean;
}

const CommonBanner: React.FC<CommonBannerProps> = ({
    title,
    highlightedText = '',
    description,
    buttonText = 'Explore More',
    buttonLink = '/',
    icon: Icon = "IoShieldCheckmarkOutline",
    iconText = "Get in Touch",
    background = 'bg-gradient-to-br from-primary via-primary-dark to-primary-darker',
    highlightColor = 'text-yellow-300',
    pattern = true,
    animation = true
}) => {
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } }
    };

    const slideUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const MotionDiv = animation ? motion.div : 'div';
    const MotionH1 = animation ? motion.h1 : 'h1';
    const MotionP = animation ? motion.p : 'p';
    const MotionSection = animation ? motion.section : 'section';

    return (
        <MotionSection
            initial={animation ? "hidden" : false}
            animate={animation ? "visible" : false}
            variants={fadeIn}
            className={`relative ${background} text-white py-24`}
        >
            {pattern && (
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:50px_52px] [mask-image:radial-gradient(ellipse_41%_45%_at_39%_56%,#000_35%,transparent_100%)]" />
            )}

            <div className="container mx-auto px-6">
                <div className="max-w-3xl">
                    {Icon && (
                        <MotionDiv
                            variants={animation ? slideUp : undefined}
                            className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                        >
                            <span className="flex items-center text-sm font-medium">
                                <Shield className="h-4 w-4 mr-2 " /> {iconText}
                            </span>
                        </MotionDiv>
                    )}

                    <MotionH1
                        variants={animation ? slideUp : undefined}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                    >
                        {title}
                        {highlightedText && (
                            <span className={highlightColor}> {highlightedText}</span>
                        )}
                    </MotionH1>

                    <MotionP
                        variants={animation ? slideUp : undefined}
                        className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl"
                    >
                        {description}
                    </MotionP>

                    {buttonText && buttonLink && (
                        <MotionDiv
                            variants={animation ? slideUp : undefined}
                            className="flex flex-wrap gap-4"
                        >
                            <Link
                                href={buttonLink}
                                className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold rounded-lg transition-all flex items-center z-10"
                            >
                                {buttonText}
                                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </MotionDiv>
                    )}
                </div>
            </div>
        </MotionSection>
    );
};

export default CommonBanner;