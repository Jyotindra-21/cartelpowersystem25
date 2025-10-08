"use client";

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useSession, signOut } from 'next-auth/react';
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, PhoneCall } from "lucide-react";
import { User } from 'next-auth';
import { ISvgLogo } from '@/schemas/logoSchema';
import { IWebsiteInfo } from '@/schemas/settingsSchema';
import Image from 'next/image';
import LogoReveal from '@/components/custom/LogoReveal';
import { memo, useEffect, useState } from 'react';

interface INavbarProps {
    websiteInfo?: IWebsiteInfo;
    svgLogo?: ISvgLogo | null;
}

const NavbarRoutes = memo(({ websiteInfo, svgLogo }: INavbarProps) => {
    const { data: session, status } = useSession();
    const user: User | undefined = session?.user;

    const [hasScrolled, setHasScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }
    return (
        <>
            <LogoSection websiteInfo={websiteInfo} svgLogo={svgLogo} />
            <div className="hidden md:flex items-center text-sm gap-x-2 md:gap-x-1 ml-auto text-black">
                <NavLink href="/" text="Home" />
                <NavLink href="/product" text="Product" />
                <AboutDropdown />
                <NavLink href="/contact" text="Contact" />

                {session && user?.isAdmin ? (
                    <AdminPanelLink hasScrolled={hasScrolled} />
                ) : (
                    <PhoneLink hasScrolled={hasScrolled} />
                )}
            </div>

            <AuthSection session={session} hasScrolled={hasScrolled} />
        </>
    );
});

const LogoSection = ({ websiteInfo, svgLogo }: INavbarProps) => (
    <motion.div
        className="ml-14 drop-shadow-[1px_1px_2px_white] rounded-tl-2xl rounded-bl-2xl"
        initial={{ filter: '0 0' }}
        animate={{ filter: '0 100%' }}
        transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
        }}
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
    </motion.div>
);

const NavLink = ({ href, text }: { href: string; text: string }) => (
    <Link href={href} passHref >
        <Button asChild size="sm" variant="navLink">
            <span>{text}</span>
        </Button>
    </Link>
);

const AboutDropdown = () => (
    <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="text-black text-sm font-semibold hover:text-secondary focus:border-none">
            About Us
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem asChild>
                <Link href="/about-us/company-overview">Company Overview</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/about-us/board-of-directors">
                    Board of Directors
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const AdminPanelLink = ({ hasScrolled }: { hasScrolled: boolean }) => (
    <Link
        href="/admin/dashboard"
        className={`text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl z-100 flex py-1 px-2 items-center text-secondary hover:bg-white/10 transition-colors ${hasScrolled ? "liquid-glass-inside" : ""} `}
    >
        Admin Panel
    </Link>
);

const PhoneLink = ({ hasScrolled }: { hasScrolled: boolean }) => (
    <a
        href="tel:+918780074795"
        className={`text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl z-100 flex py-1 px-2 items-center text-black hover:bg-white/10 transition-colors ${hasScrolled ? "liquid-glass" : ""}`}
    >
        <PhoneCall className="text-secondary mr-2 h-4 w-4" />
        +91 8780074795
    </a>
);

const AuthSection = ({ session, hasScrolled }: { session: any, hasScrolled: boolean }) => (
    <div className="ml-auto flex lg:flex">
        {session ? <Link href="#"
            type="button"
            onClick={() => signOut()}
            className={`cursor-pointer flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-black hover:text-secondary text-sm py-1 px-3 transition-colors duration-200 ${hasScrolled ? "liquid-glass" : ""}`}
        >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
        </Link> : <Link
            href="/sign-in"
            className={`cursor-pointer inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-black hover:text-secondary text-sm py-1 px-3 transition-colors duration-200 ${hasScrolled ? "liquid-glass" : ""}`}
        >
            <span>Login</span>
        </Link>}
    </div>
);



NavbarRoutes.displayName = 'NavbarRoutes';
export default NavbarRoutes;