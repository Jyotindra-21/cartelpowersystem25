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
import { memo } from 'react';

interface INavbarProps {
    websiteInfo?: IWebsiteInfo;
    svgLogo?: ISvgLogo | null;
}

const NavbarRoutes = memo(({ websiteInfo, svgLogo }: INavbarProps) => {
    const { data: session } = useSession();
    const user: User | undefined = session?.user;

    return (
        <>
            <LogoSection websiteInfo={websiteInfo} svgLogo={svgLogo} />

            <div className="hidden md:flex items-center text-sm gap-x-2 md:gap-x-1 ml-auto">
                <NavLink href="/" text="Home" />
                <NavLink href="/product" text="Product" />
                <AboutDropdown />
                <NavLink href="/contact" text="Contact" />

                {session && user?.isAdmin ? (
                    <AdminPanelLink />
                ) : (
                    <PhoneLink />
                )}
            </div>

            <AuthSection session={session} />
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
                        {websiteInfo?.metaTitle?.split(' ')?.[0] || "company logo"}
                    </h6>
                )}
            </>
        )}
    </motion.div>
);

const NavLink = ({ href, text }: { href: string; text: string }) => (
    <Link href={href} passHref legacyBehavior>
        <Button asChild size="sm" variant="navLink">
            <a>{text}</a>
        </Button>
    </Link>
);

const AboutDropdown = () => (
    <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="text-white text-sm font-semibold hover:text-secondary focus:border-none">
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

const AdminPanelLink = () => (
    <Link
        href="/admin/dashboard"
        className="text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl z-100 flex py-1 px-2 items-center text-white hover:bg-white/10 transition-colors"
    >
        Admin Panel
    </Link>
);

const PhoneLink = () => (
    <a
        href="tel:+918780074795"
        className="text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl z-100 flex py-1 px-2 items-center text-white hover:bg-white/10 transition-colors"
    >
        <PhoneCall className="text-secondary mr-2 h-4 w-4" />
        +91 8780074795
    </a>
);

const AuthSection = ({ session }: { session: any }) => (
    <div className="ml-auto flex lg:flex">
        {session ? <LogoutButton /> : <LoginButton />}
    </div>
);

const LogoutButton = () => (
    <button
        type="button"
        onClick={() => signOut()}
        className="flex items-center gap-2 w-fit bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-secondary/50 rounded-xl text-white hover:text-secondary text-sm py-1 px-2 transition-all duration-300 ease-in-out group relative overflow-hidden"
    >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-0"></span>
        <LogOut className="h-4 w-4 text-secondary group-hover:text-white transition-colors" />
        <span className="relative group-hover:scale-105 transition-transform">Logout</span>
    </button>
);

const LoginButton = () => (
    <Link href="/sign-in" passHref legacyBehavior>
        <a className="w-fit bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-secondary/50 rounded-xl text-white hover:text-secondary text-sm py-1 px-2 transition-all duration-300 ease-in-out group relative overflow-hidden">
            <span className="absolute inset-0 bg-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative group-hover:scale-105 transition-transform">Login</span>
            <span className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-white/30 transform -translate-y-full group-hover:translate-y-[300%] transition-transform duration-500"></span>
        </a>
    </Link>
);

NavbarRoutes.displayName = 'NavbarRoutes';
export default NavbarRoutes;