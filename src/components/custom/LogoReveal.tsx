'use client';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LogoPath {
    d: string;
    stroke?: string;
    className?: string;
    isAccent?: boolean;
    fill?: string;
}

interface LogoAnimationConfig {
    duration?: number;
    delayMultiplier?: number;
    accentColor?: string;
    mainColor?: string;
    initialStrokeWidth?: number;
}

interface LogoData {
    viewBox: string;
    paths: LogoPath[];
    animation?: LogoAnimationConfig;
}

interface LogoRevealProps {
    size?: number;
    initialData?: LogoData; // Optional prop for server-side data
}

const defaultAnimationConfig = {
    duration: 2,
    delayMultiplier: 0.5,
    accentColor: 'rgba(226, 29, 35, 1)',
    mainColor: 'rgba(26, 28, 115, 1)',
    initialStrokeWidth: 2,
};

export default function LogoReveal({ size = 150, initialData }: LogoRevealProps) {
    const [logoData, setLogoData] = useState<LogoData | null>(initialData || null);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [animationConfig, setAnimationConfig] = useState({
        ...defaultAnimationConfig,
        ...(initialData?.animation || {})
    });

    useEffect(() => {
        // Only fetch if no initialData was provided
        if (!initialData) {
            const fetchLogoData = async () => {
                try {
                    const response = await fetch('/api/logo');
                    if (!response.ok) throw new Error('Failed to fetch logo');
                    const data: LogoData = await response.json();

                    setLogoData(data);
                    setAnimationConfig({
                        ...defaultAnimationConfig,
                        ...(data.animation || {}),
                    });
                } catch (error) {
                    console.error('Error fetching logo:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchLogoData();
        }
    }, [initialData]);

    const drawVariants: Variants = {
        hidden: (path: LogoPath) => ({
            pathLength: 0,
            opacity: 0,
            fill: 'rgba(255, 255, 255, 0)',
            stroke: path.stroke || animationConfig.mainColor,
            strokeWidth: animationConfig.initialStrokeWidth,
        }),
        visible: (custom: { index: number; path: LogoPath }) => {
            // const isAccent = custom.path.isAccent || custom.path.className?.includes('accent');
            return {
                pathLength: 1,
                opacity: 1,
                fill: custom?.path?.stroke ? custom?.path?.stroke : custom?.path?.fill,
                strokeWidth: 0,
                transition: {
                    pathLength: {
                        duration: animationConfig.duration,
                        ease: 'linear',
                        delay: custom.index * animationConfig.delayMultiplier,
                    },
                    fill: {
                        duration: 0.5,
                        delay: custom.index * animationConfig.delayMultiplier + animationConfig.duration * 0.75,
                    },
                    strokeWidth: {
                        delay: custom.index * animationConfig.delayMultiplier + animationConfig.duration,
                    },
                    opacity: {
                        duration: 0.01,
                    },
                },
            };
        },
    };

    if (isLoading) {
        return (
            <div
                className="flex items-center justify-center bg-gray-100 rounded-lg"
                style={{ width: size, height: size / 3 }}
            >
                <div className="animate-pulse">Loading logo...</div>
            </div>
        );
    }

    if (!logoData) {
        return (
            <div
                className="flex items-center justify-center bg-gray-100 rounded-lg text-red-500"
                style={{ width: size, height: size / 3 }}
            >
                Logo not available
            </div>
        );
    }

    return (
        <div className="inline-block" style={{ width: size }}>
            <motion.svg
                width="100%"
                height="auto"
                viewBox={logoData.viewBox}
                initial="hidden"
                animate="visible"
                aria-label="Company logo"
            >
                {logoData.paths.map((path, index) => (
                    <motion.path
                        key={`path-${index}`}
                        d={path.d}
                        variants={drawVariants}
                        custom={{ index, path }}
                        stroke={path.stroke || animationConfig.mainColor}
                        className={path.className}
                        strokeWidth={animationConfig.initialStrokeWidth}
                        fill="transparent"
                        style={{
                            vectorEffect: 'non-scaling-stroke',
                        }}
                        aria-hidden="true"
                    />
                ))}
            </motion.svg>
        </div>
    );
}