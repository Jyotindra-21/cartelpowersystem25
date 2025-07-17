'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Settings,
  ShoppingCart,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

interface SidebarProps {
  closeMobileMenu?: () => void
}

export function AdminSidebar({ closeMobileMenu }: SidebarProps) {
  const pathname = usePathname()
  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: ShoppingCart,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  return (
    <div className="fixed w-64 sm:w-auto top-0 z-50 h-[100vh] flex-col border-r bg-slate-100 ">
      <div className="flex flex-col h-16 flex-shrink-0 items-start pl-4 pt-2 pr-2  border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 drop-shadow-[1px_1px_2px_white]">
          {/* <LogoReveal /> */}
          logo
          </h1>
        <h6 className='leading-[12px] tracking-[5px] text-red-500 '>Admin Panel</h6>
      </div>
      <div className=" flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => closeMobileMenu && closeMobileMenu()}
              className={cn(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                pathname === item.href
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  pathname === item.href
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="fixed p-4 bottom-0 w-64 md:w-44">
        <Button variant="destructive" onClick={() => signOut()} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}