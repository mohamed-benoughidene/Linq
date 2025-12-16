"use client"

import * as React from "react"
import { ChevronsUpDown, FileText, Plus } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useBuilderStore } from "@/store/builder-store"

export function PageSwitcher() {
    const { isMobile } = useSidebar()
    const { pages, activePageId, setActivePage, openCreatePage } = useBuilderStore()

    const activePage = pages.find(p => p.id === activePageId) || pages[0]

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            data-id="sidebar-page-switcher-trigger"
                        >
                            <span className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <FileText className="size-4" />
                            </span>
                            <span className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{activePage.name}</span>
                                <span className="truncate text-xs">/{activePage.slug}</span>
                            </span>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs tracking-tight">
                            Pages
                        </DropdownMenuLabel>
                        {pages.map((page, index) => (
                            <DropdownMenuItem
                                key={page.id}
                                onClick={() => setActivePage(page.id)}
                                className="gap-2 p-2"
                                data-id={`sidebar-page-switcher-option-${page.id}`}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <FileText className="size-3.5 shrink-0" />
                                </div>
                                {page.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" onClick={openCreatePage}>
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">Create New Page</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
