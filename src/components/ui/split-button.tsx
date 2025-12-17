"use client"

import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SplitButtonProps extends ButtonProps {
    onMainAction?: (e: React.MouseEvent<HTMLButtonElement>) => void
    menuContent: React.ReactNode
    menuAlign?: "start" | "end" | "center"
    menuClassName?: string
}

export function SplitButton({
    children,
    onMainAction,
    menuContent,
    menuAlign = "end",
    menuClassName,
    className,
    variant = "default",
    ...props
}: SplitButtonProps) {
    return (
        <div className="flex items-center gap-[1px]">
            <Button
                className={cn("rounded-r-none", className)}
                variant={variant}
                onClick={onMainAction}
                {...props}
            >
                {children}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className={cn("rounded-l-none px-2 border-l border-white/20", className)}
                        variant={variant}
                        {...props}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={menuAlign} className={menuClassName}>
                    {menuContent}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
