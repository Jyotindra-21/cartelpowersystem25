"use client";

import { IWebsiteInfo } from "@/schemas/settingsSchema";
import { Navbar } from "./navbar";
import { useState, useEffect } from "react";
import { ISvgLogo } from "@/schemas/logoSchema";

interface IMobileSidebarProps {
    websiteInfo?: IWebsiteInfo
    svgLogo?: ISvgLogo | null
}

export function ScrollHeader({ websiteInfo, svgLogo }: IMobileSidebarProps) {
    const [hasScrolled, setHasScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`h-[60px] fixed top-0 left-1/2 transform -translate-x-1/2 w-full  mx-auto z-50 bg-white/10 backdrop-blur-sm   transition-all duration-300 ${hasScrolled ? "md:mt-2  md:w-[85%] md:rounded-full liquid-glass" : "bg-gradient-to-l from-primary/80 to-primary/90 "
                }`}
        >
            <Navbar svgLogo={svgLogo} websiteInfo={websiteInfo} />
        </header>
    );
}