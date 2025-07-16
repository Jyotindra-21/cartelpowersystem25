"use client"
import { cn } from "@/lib/utils"
import { ChevronDown, LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  setOpen?: (open: boolean) => void;
  color?: string;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  isChildItem?: boolean;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  setOpen,
  color = "text-gray-400",
  hasChildren = false,
  isExpanded = false,
  onToggle,
  isChildItem = false
}: SidebarItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href ||
    (pathname?.startsWith(`${href}`) && href !== "/")

  // const router = useRouter()
  const onClick = () => {
    if (hasChildren && onToggle) {
      onToggle();
    } else {
      setOpen?.(false);
      // router.push(href);
    }
  };

  return (
    <Link
      href={hasChildren && onToggle ? "" : href}
      // whileHover={{ scale: 1.02 }}
      // whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-1 py-1 rounded-full transition-all",
        "text-left text-sm font-medium border border-white/5",
        isChildItem ? "" : "",
        isActive
          ? "text-white bg-white/10 backdrop-blur-sm"
          : `text-gray-300 hover:text-white hover:bg-white/5 ${color}`
      )}
    >
      <div className={cn(
        "p-1.5 rounded-full",
        isActive ? "bg-white/20" : "bg-white/5"
      )}>
        <Icon
          size={18}
          className={cn(
            isActive ? "text-white" : color
          )}
        />
      </div>

      <span className="flex-1">{label}</span>

      {hasChildren && (
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "ml-auto p-1 rounded-full",
            isActive ? "bg-white/20" : "bg-white/5"
          )}
        >
          <ChevronDown
            size={20}
            className={cn(
              isActive ? "text-white" : "text-gray-400"
            )}
          />
        </motion.div>
      )}
    </Link>
  )
}