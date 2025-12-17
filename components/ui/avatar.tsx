"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="avatar"
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
)
Avatar.displayName = "Avatar"

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading")

    React.useEffect(() => {
      if (!src) {
        setStatus("error")
        return
      }
      setStatus("loading")
    }, [src])

    const handleLoad = () => {
      setStatus("loaded")
      onLoadingStatusChange?.("loaded")
    }

    const handleError = () => {
      setStatus("error")
      onLoadingStatusChange?.("error")
    }

    if (status === "error" || !src) {
      return null
    }

    return (
      <img
        ref={ref}
        data-slot="avatar-image"
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  delayMs?: number
}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, delayMs, children, ...props }, ref) => {
    const [canRender, setCanRender] = React.useState(delayMs === undefined)

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timeout = setTimeout(() => setCanRender(true), delayMs)
        return () => clearTimeout(timeout)
      }
    }, [delayMs])

    if (!canRender) {
      return null
    }

    return (
      <span
        ref={ref}
        data-slot="avatar-fallback"
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
