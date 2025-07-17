'use client'

import { House, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserNav } from './user-nav'
import Link from 'next/link'


interface AdminNavbarProps {
  setSidebarOpen: (open: boolean) => void
}

export function AdminNavbar({ setSidebarOpen }: AdminNavbarProps) {

  return (
    <div className="fixed w-[100vw] top-0 z-10 border-b border-slate-200 bg-slate-100">
      <div className="flex h-16 items-center">
        <Button
          variant="ghost"
          className="ml-2 lg:hidden text-slate-700 border-none"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <div className="flex flex-1 justify-end">
          <div className="ml-4 flex items-center md:ml-6 p-4 ">

            <Link href="/" className='hidden md:block'>
              <Button variant="muted" className="w-full">
                <House className="h-4 w-4" />
                Home Page
              </Button>
            </Link>
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  )
}