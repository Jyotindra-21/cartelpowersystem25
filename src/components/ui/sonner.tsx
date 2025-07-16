"use client"

import { Toaster as SonnerToaster } from "sonner"
import { useTheme } from "next-themes"

export function Toaster() {
  const { theme } = useTheme()

  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      position="top-center"
      className="toaster"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-muted text-muted-foreground hover:bg-muted/90",
          closeButton: "absolute right-2 top-2 text-foreground/50 hover:text-foreground",
          success: "bg-green-400 text-green-900",
          error: "bg-destructive text-destructive-foreground",
        },
      }}
    />
  )
}