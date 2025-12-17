"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    return (
      <SeparatorPrimitive
        ref={ref}
        data-slot="separator"
        orientation={orientation}
        className={cn(
          "bg-border shrink-0 data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px] data-[orientation=vertical]:self-stretch",
          className
        )}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator"

export { Separator }
