"use client"
import { Menu, X } from "lucide-react"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from "./sidebar"
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IWebsiteInfo } from "@/schemas/settingsSchema";
import { ISvgLogo } from "@/schemas/logoSchema";

interface IMobileSidebarProps {
    websiteInfo?: IWebsiteInfo
    svgLogo?: ISvgLogo | null
}

export const MobileSidebar = ({ websiteInfo, svgLogo }: IMobileSidebarProps) => {
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const [swipeProgress, setSwipeProgress] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const isSwiping = useRef<boolean>(false);
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            // Only start tracking from left edge (20px)
            if (e.touches[0].clientX > 100) return;

            touchStartX.current = e.touches[0].clientX;
            isSwiping.current = false;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (touchStartX.current === null || sheetOpen) return;

            const currentX = e.touches[0].clientX;
            const deltaX = currentX - touchStartX.current;

            // Only consider it a swipe after some threshold
            if (Math.abs(deltaX) > 10) {
                isSwiping.current = true;
            }

            // Only prevent scroll if swiping right significantly
            if (deltaX > 30) {
                e.preventDefault();
                const progress = Math.min(deltaX / 100, 1);
                setSwipeProgress(progress);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!isSwiping.current || !touchStartX.current || sheetOpen) {
                touchStartX.current = null;
                return;
            }

            const currentX = e.changedTouches[0].clientX;
            const deltaX = currentX - touchStartX.current;

            if (deltaX > 100) {
                setSheetOpen(true);
            }
            setSwipeProgress(0);
            touchStartX.current = null;
            isSwiping.current = false;
        };

        // Add event listeners to document instead of an overlay
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [sheetOpen]);

    return (
        <>
            {swipeProgress > 0 && (
                <div className="fixed inset-0 md:hidden z-30 pointer-events-none">
                    <div
                        className="absolute left-0 top-0 bottom-0 bg-secondary/20"
                        style={{
                            width: `${swipeProgress * 100}%`,
                            transition: 'width 0.1s linear'
                        }}
                    />
                </div>
            )}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="md:hidden p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] fixed left-4 top-4 z-50"
                    >
                        <Menu className="h-5 w-5 text-secondary" />
                    </motion.button>
                </SheetTrigger>

                <SheetContent
                    hideClose
                    side={"left"}
                    className="p-0 bg-transparent backdrop-blur-md border-r border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                >
                    <SheetClose asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 z-50"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5 text-secondary" />
                        </motion.button>
                    </SheetClose>
                    <Sidebar setOpen={setSheetOpen} websiteInfo={websiteInfo} svgLogo={svgLogo} />
                </SheetContent>
            </Sheet>
        </>
    )
}