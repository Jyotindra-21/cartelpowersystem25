// navbar.tsx
import { MobileSidebar } from "./mobile-sidebar"
import NavbarRoutes from "./navbar-routes";
import { fetchWebsiteInfo } from "@/services/settings.services";
import { getActiveSvgLogo } from "@/services/svglogo.services";
import { Suspense } from 'react';

export const Navbar = async () => {
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