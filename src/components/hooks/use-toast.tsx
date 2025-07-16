"use client"

import { toast as sonnerToast } from "sonner"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type Toast = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function toast({ title, description, action, variant }: Toast) {
  return sonnerToast.custom((t) => (
    <div className={cn(
      "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg",
      variant === "destructive" 
        ? "border-destructive bg-destructive text-destructive-foreground" 
        : "border bg-background text-foreground"
    )}>
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action}
      <button
        onClick={() => sonnerToast.dismiss(t)}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity",
          "hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100",
          variant === "destructive" && "text-red-300 hover:text-red-50"
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ))
}

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    success: sonnerToast.success,
    error: sonnerToast.error,
    promise: sonnerToast.promise,
  }
}