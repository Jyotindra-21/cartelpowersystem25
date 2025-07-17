'use client'

import { useState } from 'react'
import { AdminSidebar } from './_components/sidebar'
import { AdminNavbar } from './_components/navbar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex bg-gray-50">
            {/* Sidebar - Show on desktop, hide on mobile */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <AdminSidebar />
            </div>

            {/* Mobile sidebar (shown when sidebarOpen is true) */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col ">
                    <AdminSidebar closeMobileMenu={() => setSidebarOpen(false)} />
                </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-1 flex-col min-w-0"> {/* Remove h-screen here */}
                {/* Navbar with mobile menu button */}
                <AdminNavbar setSidebarOpen={setSidebarOpen} />

                {/* Scrollable main content */}
                <main className="flex-1 p-4   for-my-scrollbar ml-0 lg:ml-44 mt-16">
                    <div className="min-h-full ">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    )
}