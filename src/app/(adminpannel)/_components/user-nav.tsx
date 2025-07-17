'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { House, LogOut, Settings, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'

export function UserNav() {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    
      <DropdownMenu>
        <div className='flex flex-col justify-end items-end '>
          <p className='ml-2 text-slate-700 capitalize font-bold'>{session && user?.username}</p>
          <p className='ml-2 text-xs text-blue-500 capitalize font-bold leading-[9px]'>{session && user?.role === "admin" && "Super Admin"}</p>
        </div>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2 ">
            <Avatar className="h-8 w-8 bg-yellow-700 border-2 border-white">
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback className='bg-transparent' >{session && user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span onClick={() => signOut()}>Log out</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <House className="mr-2 h-4 w-4" />
            <Link href="/">Home Page</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    
  )
}