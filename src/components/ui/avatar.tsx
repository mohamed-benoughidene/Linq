"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

import { useComponentId } from "@/lib/component-id"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  const componentId = useComponentId("Avatar")
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-component-id={componentId}
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const componentId = useComponentId("AvatarImage")
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      data-component-id={componentId}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const componentId = useComponentId("AvatarFallback")
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      data-component-id={componentId}
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
