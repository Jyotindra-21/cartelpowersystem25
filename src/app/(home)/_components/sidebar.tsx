"use client"
import SidebarRoutes from "./sidebar-routes";
import { motion } from "framer-motion";
import { PhoneCall, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import LogoReveal from "@/components/custom/LogoReveal";
import { IWebsiteInfo } from "@/schemas/settingsSchema";
import { ISvgLogo } from "@/schemas/logoSchema";

interface SidebarProps {
    setOpen?: (open: boolean) => void
    websiteInfo?:IWebsiteInfo,
    svgLogo?:ISvgLogo
}

const Sidebar = ({ setOpen,websiteInfo , svgLogo }: SidebarProps) => {
    const { data: session } = useSession();
    const user: User = session?.user;
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="h-full flex flex-col bg-gradient-to-tr from-neutral-900  to-neutral-800"
        >
            {/* Glass Header */}
            <div className="flex flex-col items-start justify-center p-2 border-b">
                <div
                    className="bg-white/5 border border-white/20 hover:bg-blue-500/15 w-full p-2 rounded-full drop-shadow-[1px_1px_3px_#7e7c7c]"
                >
                    {/* Logo container with border gradient */}
                    <div>
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
                                {!websiteInfo?.logo ? (<>
                                    <h6 className='uppercase text-3xl'>
                                        {websiteInfo?.metaTitle?.split(' ')?.[0] || ""}
                                    </h6>
                                </>) : (

                                    <Image src={websiteInfo?.logo} alt='logo-image' width={150} height={200} />
                                )}
                            </>

                        )}
                    </div>
                    {/* <div className="text-blue-400 text-sm">Jyotindrakushwah9996@gmail.com</div> */}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1 ">
                <SidebarRoutes setOpen={setOpen} />
            </div>

            {/* Glass Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 border-t border-white/10  backdrop-blur-md "
            >
                {session ? (
                    <>
                        {user?.isAdmin && (
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <Link
                                    href="/admin/dashboard"
                                    onClick={() => setOpen?.(false)}
                                    className="flex items-center justify-between px-4 py-3 mb-3 rounded-xl bg-blue-500/10 border border-blue-400/20 hover:bg-blue-500/20 transition-all"
                                >
                                    <span className="text-blue-400">Admin Panel</span>
                                    <ChevronDown className="h-4 w-4 text-blue-400 rotate-90" />
                                </Link>
                            </motion.div>
                        )}
                        <div className="text-center text-sm text-white/60">
                            @{" "}{user?.username || user?.email}
                        </div>
                    </>
                ) : (
                    <>
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Link
                                href="/sign-up"
                                onClick={() => setOpen?.(false)}
                                className="block w-full px-4 py-3 mb-3 text-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all"
                            >
                                Create Account
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <a
                                href="tel:+918780074795"
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <PhoneCall className="h-4 w-4 text-white" />
                                <span className="text-white/80">Support</span>
                            </a>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

export default Sidebar;