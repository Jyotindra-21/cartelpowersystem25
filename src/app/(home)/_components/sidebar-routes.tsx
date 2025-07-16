"use client"
import { Layout, List, Headset, User, House, ChevronRight } from "lucide-react"
import { SidebarItem } from "./sidebar-item"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface RouteItem {
  icon: any;
  label: string;
  href: string;
  color: string;
  children?: ChildRouteItem[];
}

interface ChildRouteItem {
  icon: any;
  label: string;
  href: string;
  color: string;
}

const guestRoutes: RouteItem[] = [
  {
    icon: House,
    label: "Home",
    href: "/",
    color: "text-blue-400"
  },
  {
    icon: List,
    label: "Products",
    href: "/product",
    color: "text-emerald-400"
  },
  {
    icon: User,
    label: "About Us",
    href: "/about-us",
    color: "text-purple-400",
    children: [
      {
        icon: ChevronRight,
        label: "Company Overview",
        href: "/about-us/company-overview",
        color: "text-purple-300"
      },
      {
        icon: ChevronRight,
        label: "Board of Directors",
        href: "/about-us/board-of-directors",
        color: "text-purple-300"
      }
    ]
  },
  {
    icon: Headset,
    label: "Contact",
    href: "/contact",
    color: "text-amber-400"
  }
]

const adminRoutes: RouteItem[] = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/admin/Dashboard",
    color: "text-rose-400"
  }
]

const SidebarRoutes = ({ setOpen }: { setOpen?: (open: boolean) => void }) => {
  const pathname = usePathname()
  const isTeacherPage = pathname?.includes("/teacher")
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (href: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href]
    }))
  }

  const routes = isTeacherPage ? adminRoutes : guestRoutes

  return (
    <div className="flex flex-col w-full space-y-3">
      {routes.map((route) => (
        <motion.div 
          key={route.href}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Background highlight */}
          <motion.div
            className={cn(
              "absolute inset-0  rounded-xl -z-10",
              pathname === route.href && "bg-blue-500/10"
            )}
            whileHover={{ opacity: 1 }}
          />
          
          <SidebarItem
            icon={route.icon}
            label={route.label}
            href={route.href}
            setOpen={setOpen}
            color={route.color}
            hasChildren={!!route.children}
            isExpanded={expandedItems[route.href]}
            onToggle={() => route.children && toggleExpand(route.href)}
          />
          
          <AnimatePresence>
            {route.children && expandedItems[route.href] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="pl-8 overflow-hidden"
              >
                {route.children.map((child) => (
                  <motion.div
                    key={child.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative py-1"
                  >
                    {/* Child item indicator line */}
                    <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-500/30" />
                    
                    <SidebarItem
                      label={child.label}
                      href={child.href}
                      icon={child.icon}
                      setOpen={setOpen}
                      color={child.color}
                      isChildItem
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

export default SidebarRoutes