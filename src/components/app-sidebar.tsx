"use client"

import * as React from "react"
import {
  BarChart2,
  Palette,
  Settings2,
  Plus,
  Share2
} from "lucide-react"

import { SharePopover } from "@/components/builder/share-popover"

import { useBuilderStore } from "@/store/builder-store"
import { PageSwitcher } from "@/components/dashboard/page-switcher"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setActivePanel, activePanel, setView, view } = useBuilderStore()

  // Define nav items
  const navItems = [
    {
      label: "Blocks",
      icon: Plus,
      isActive: activePanel === 'blocks',
      onClick: () => {
        setView('editor')
        setActivePanel(activePanel === 'blocks' ? null : 'blocks')
      },
      id: "sidebar-nav-blocks"
    },
    {
      label: "Design",
      icon: Palette,
      isActive: activePanel === 'themes',
      onClick: () => {
        setView('editor')
        setActivePanel(activePanel === 'themes' ? null : 'themes')
      },
      id: "sidebar-nav-design"
    },
    {
      label: "Analytics",
      icon: BarChart2,
      isActive: view === 'analytics',
      onClick: () => {
        setView('analytics')
        setActivePanel(null)
      },
      id: "sidebar-nav-analytics"
    },
    {
      label: "Settings",
      icon: Settings2,
      isActive: activePanel === 'settings',
      onClick: () => {
        setView('editor')
        setActivePanel(activePanel === 'settings' ? null : 'settings')
      },
      id: "sidebar-nav-settings"
    }
  ]

  return (
    <Sidebar collapsible="none" className="!w-[64px] border-r border-slate-200 bg-white" {...props} data-id="sidebar-app-container">
      <SidebarHeader className="flex items-center justify-center border-b border-slate-100 py-2">
        <PageSwitcher />
      </SidebarHeader>

      <SidebarContent className="flex flex-col items-center gap-4 py-4">
        {navItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <button
                onClick={item.onClick}
                data-id={item.id}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200",
                  item.isActive
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </SidebarContent>

      <SidebarFooter className="py-4 flex flex-col items-center gap-4">
        <SharePopover
          trigger={
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  data-id="sidebar-share-btn"
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Share
              </TooltipContent>
            </Tooltip>
          }
        />
        <NavUser user={{
          name: "John Doe",
          email: "john@example.com",
          avatar: "https://github.com/shadcn.png"
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
