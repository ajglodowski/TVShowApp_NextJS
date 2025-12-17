"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ ...props }: { children: React.ReactNode; delayDuration?: number }) {
  // Base UI doesn't have a provider pattern, but we keep this for API compatibility
  return <>{props.children}</>
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ asChild, children, ...props }: TooltipPrimitive.Trigger.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <TooltipPrimitive.Trigger 
        data-slot="tooltip-trigger" 
        render={children}
        {...props} 
      />
    )
  }
  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  )
}

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    sideOffset?: number
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
  }
>(({ className, sideOffset = 4, side = "top", align = "center", ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      className="z-50"
    >
      <TooltipPrimitive.Popup
        ref={ref}
        data-slot="tooltip-content"
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
