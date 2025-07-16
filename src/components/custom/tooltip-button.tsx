"use client"

import { ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react"

interface TooltipButtonProps extends ButtonProps {
  tooltipContent: ReactNode
  asChild?: boolean
}

export function TooltipButton({
  tooltipContent,
  children,
  asChild = false,
  ...buttonProps
}: TooltipButtonProps) {
  return (
    <Tooltip delayDuration={200} >
      <TooltipTrigger asChild={asChild}>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        {typeof tooltipContent === "string" ? (
          <p>{tooltipContent}</p>
        ) : (
          tooltipContent
        )}
      </TooltipContent>
    </Tooltip>
  )
}