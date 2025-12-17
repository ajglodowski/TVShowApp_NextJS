"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, defaultValue, onValueChange, max = 100, min = 0, step = 1, disabled, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      max={max}
      min={min}
      step={step}
      disabled={disabled}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Control className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Track className="absolute h-full">
          <SliderPrimitive.Indicator className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
)
Slider.displayName = "Slider"

export { Slider }
