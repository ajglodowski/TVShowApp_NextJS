"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

import { cn } from "@/lib/utils"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ asChild, children, className, ...props }: CollapsiblePrimitive.Trigger.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <CollapsiblePrimitive.Trigger 
        data-slot="collapsible-trigger" 
        render={children}
        className={cn(className)}
        {...props} 
      />
    )
  }
  return (
    <CollapsiblePrimitive.Trigger 
      data-slot="collapsible-trigger" 
      className={cn(className)}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  )
}

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    data-slot="collapsible-content"
    className={cn("overflow-hidden", className)}
    {...props}
  />
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
