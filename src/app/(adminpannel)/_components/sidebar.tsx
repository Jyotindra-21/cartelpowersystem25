'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Settings,
  ShoppingCart,
  LogOut,
  Phone,
  UserSearch,
  CalendarSearch
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { IApiResponse } from '@/types/ApiResponse'
import { IWebsiteInfo } from '@/schemas/settingsSchema'
import { ISvgLogo } from '@/schemas/logoSchema'
import { fetchWebsiteInfo } from '@/services/settings.services'
import { getActiveSvgLogo } from '@/services/svglogo.services'
import { useEffect, useState } from 'react'
import { toast } from '@/components/hooks/use-toast'
import Image from 'next/image'
import LogoReveal from '@/components/custom/LogoReveal'

interface SidebarProps {
  closeMobileMenu?: () => void
}

export function AdminSidebar({ closeMobileMenu }: SidebarProps) {

  const [svgLogo, setSvgLogo] = useState<ISvgLogo | null>(null)
  const [websiteInfo, setWebsiteInfo] = useState<IWebsiteInfo | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [websiteInfoRes, svgLogo] = await Promise.all([
        fetchWebsiteInfo() as Promise<IApiResponse<IWebsiteInfo>>,
        getActiveSvgLogo() as Promise<ISvgLogo>,
      ]);
      const { data: websiteInfo } = websiteInfoRes;
      if (websiteInfo) setWebsiteInfo(websiteInfo)
      setSvgLogo(svgLogo)
    } catch (error) {
      toast({ title: "Error", description: `Error : ${error}` })
    } finally {
      setIsLoading(false)
    }
  }

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
      name: 'Contacts',
      href: '/admin/contacts',
      icon: Phone,
    },
    {
      name: 'Visitor',
      href: '/admin/visitor',
      icon: UserSearch,
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: CalendarSearch,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="fixed w-64 sm:w-auto top-0 z-50 h-[100vh] flex-col border-r bg-slate-100 ">
      <div className="flex flex-col h-16 flex-shrink-0 items-start pl-4 pt-2 pr-2  border-b border-gray-200">

        {isLoading ? "" : websiteInfo?.isSvg ? (
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
            {websiteInfo?.logo ? (
              <Image
                unoptimized
                src={websiteInfo.logo}
                alt="logo-image"
                width={150}
                height={200}
              />
            ) : (
              <h6 className='uppercase text-3xl'>
                {websiteInfo?.metaTitle?.split(' ')?.[0] || ""}
              </h6>
            )}
          </>
        )}
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