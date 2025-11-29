"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useComponentId } from "@/lib/component-id"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("Card")
  return (
    <div
      data-slot="card"
      data-component-id={componentId}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("CardHeader")
  return (
    <div
      data-slot="card-header"
      data-component-id={componentId}
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("CardTitle")
  return (
    <div
      data-slot="card-title"
      data-component-id={componentId}
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("CardDescription")
  return (
    <div
      data-slot="card-description"
      data-component-id={componentId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("CardAction")
  return (
    <div
      data-slot="card-action"
      data-component-id={componentId}
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("CardContent")
  return (
    <div
      data-slot="card-content"
      data-component-id={componentId}
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const componentId = useComponentId("CardFooter")
  return (
    <div
      data-slot="card-footer"
      data-component-id={componentId}
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
