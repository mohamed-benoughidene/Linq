"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { useComponentId } from "@/lib/component-id"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  const componentId = useComponentId("Breadcrumb")
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" data-component-id={componentId} {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  const componentId = useComponentId("BreadcrumbList")
  return (
    <ol
      data-slot="breadcrumb-list"
      data-component-id={componentId}
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  const componentId = useComponentId("BreadcrumbItem")
  return (
    <li
      data-slot="breadcrumb-item"
      data-component-id={componentId}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"
  const componentId = useComponentId("BreadcrumbLink")

  return (
    <Comp
      data-slot="breadcrumb-link"
      data-component-id={componentId}
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  const componentId = useComponentId("BreadcrumbPage")
  return (
    <span
      data-slot="breadcrumb-page"
      data-component-id={componentId}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  const componentId = useComponentId("BreadcrumbSeparator")
  return (
    <li
      data-slot="breadcrumb-separator"
      data-component-id={componentId}
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const componentId = useComponentId("BreadcrumbEllipsis")
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      data-component-id={componentId}
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
