// navbar.tsx
import { MobileSidebar } from "./mobile-sidebar"
<<<<<<< HEAD
import NavbarRoutes from "./navbar-routes";
import { fetchWebsiteInfo } from "@/services/settings.services";
import { getActiveSvgLogo } from "@/services/svglogo.services";
import { Suspense } from 'react';

export const Navbar = async () => {
=======
import { NavbarRoutes } from "./navbar-routes";
export const Navbar = () => {
>>>>>>> 55ff9e80e78b1734cecc5d93a70cbc211e1c8f7f
    return (
        <div className="px-4 h-full flex items-center shadow-sm dark:bg-slate-950 max-w-[1200px] m-auto">
            <Suspense fallback={<>loading..</>}>
                <NavbarContent />
            </Suspense>
        </div>
    )
}
async function NavbarContent() {
    const [websiteInfo, svgLogo] = await Promise.all([
        fetchWebsiteInfo(),
        getActiveSvgLogo()
    ]);

    return (
        <>
            <MobileSidebar
                svgLogo={svgLogo}
                websiteInfo={websiteInfo?.data}
            />
            <NavbarRoutes
                svgLogo={svgLogo}
                websiteInfo={websiteInfo?.data}
            />
        </>
    );
}