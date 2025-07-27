'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
export const TrackingScript = () => {
    const pathname = usePathname()
    useEffect(() => {
        if (pathname.startsWith('/admin')) return
        fetch(`/api/web_t`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
        }).catch(() => { })
    }, [pathname])

    return null
}
