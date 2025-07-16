
import { MobileSidebar } from "./mobile-sidebar"
import { IWebsiteInfo } from "@/schemas/settingsSchema";
import { IApiResponse } from "@/types/ApiResponse";
import { NavbarRoutes } from "./navbar-routes";
import { fetchWebsiteInfo } from "@/services/settings.services";
import { getActiveSvgLogo } from "@/services/svglogo.services";

export const Navbar = async () => {
    const { data }: IApiResponse<IWebsiteInfo> = await fetchWebsiteInfo();
    const svgLogo = await getActiveSvgLogo() || undefined
    if (data && svgLogo) {
        return (<div className="px-4 h-full flex items-center shadow-sm dark:bg-slate-950 max-w-[1200px] m-auto">
            <MobileSidebar svgLogo={svgLogo} websiteInfo={data} />
            <NavbarRoutes svgLogo={svgLogo} websiteInfo={data} />
        </div>)
    }
    return (
        <div className="px-4 h-full flex items-center shadow-sm dark:bg-slate-950 max-w-[1200px] m-auto">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}