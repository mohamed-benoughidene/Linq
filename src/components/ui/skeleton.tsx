"use client"

import { cn } from "@/lib/utils"
import { useComponentId } from "@/lib/component-id"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("Skeleton")
  return (
    <div
      data-slot="skeleton"
      data-component-id={componentId}
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
