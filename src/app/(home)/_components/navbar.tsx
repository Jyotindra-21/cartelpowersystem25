import { IWebsiteInfo } from "@/schemas/settingsSchema";
import { MobileSidebar } from "./mobile-sidebar"
import NavbarRoutes from "./navbar-routes";
import { Suspense } from 'react';
import { ISvgLogo } from "@/schemas/logoSchema";

interface IMobileSidebarProps {
    websiteInfo?: IWebsiteInfo
    svgLogo?: ISvgLogo | null
}

export const Navbar = ({ websiteInfo, svgLogo }: IMobileSidebarProps) => {
    return (
        <div className="px-4 h-full flex items-center shadow-sm dark:bg-slate-950 max-w-[1200px] m-auto">
            <Suspense fallback={<>loading..</>}>
                <NavbarContent websiteInfo={websiteInfo} svgLogo={svgLogo} />
            </Suspense>
        </div>
    )
}
function NavbarContent({ websiteInfo, svgLogo }: IMobileSidebarProps) {
    return (
        <>
            <MobileSidebar
                svgLogo={svgLogo}
                websiteInfo={websiteInfo}
            />
            <NavbarRoutes
                svgLogo={svgLogo}
                websiteInfo={websiteInfo}
            />
        </>
    );
}