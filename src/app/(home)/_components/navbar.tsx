
import { MobileSidebar } from "./mobile-sidebar"
import { NavbarRoutes } from "./navbar-routes";
export const Navbar = () => {
    return (
        <div className="px-4 h-full flex items-center shadow-sm dark:bg-slate-950 max-w-[1200px] m-auto">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}