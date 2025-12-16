"use client"

import { ChevronRight, Plus, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { useBuilderStore } from "@/store/builder-store"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    onClick?: () => void
    items?: {
      title: string
      url: string // Can be '#' if onClick is present
      icon?: LucideIcon
      onClick?: () => void
    }[]
  }[]
}) {
  const { togglePanel, activePanel } = useBuilderStore()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="tracking-tight">Builder</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Special Case: "Appearance" (Themes Panel Toggle)
          // We can eventually move this to the data config too if we expose store access there
          if (item.title === "Theme") {
            const isActive = activePanel === 'themes'
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  data-id={`sidebar-nav-main-item-${item.title}`}
                  onClick={() => togglePanel('themes')}
                  isActive={isActive}
                  className={isActive ? "text-violet-600 bg-violet-50 hover:bg-violet-100 hover:text-violet-700" : ""}
                >
                  {item.icon && <item.icon className={isActive ? "text-violet-600" : "text-slate-600"} />}
                  <span className={isActive ? "font-medium" : ""}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Special Case: "Page Settings" (Settings Panel Toggle)
          if (item.title === "Page Settings") {
            const isActive = activePanel === 'settings'
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  data-id={`sidebar-nav-main-item-${item.title}`}
                  isActive={isActive}
                  onClick={() => togglePanel('settings')}
                  className={isActive ? "text-violet-600 bg-violet-50 hover:bg-violet-100 hover:text-violet-700" : ""}
                >
                  {item.icon && <item.icon className={isActive ? "text-violet-600" : "text-slate-600"} />}
                  <span className={isActive ? "font-medium" : ""}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Check for sub-items
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} data-id={`sidebar-nav-main-item-${item.title}`}>
                      {item.icon && <item.icon className={item.isActive ? "text-slate-900" : "text-slate-600"} />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild={!subItem.onClick}
                            onClick={subItem.onClick}
                            className="cursor-pointer hover:bg-slate-100 transition-colors"
                          >
                            {subItem.onClick ? (
                              <div className="flex items-center gap-2" data-id={`sidebar-nav-main-subitem-${subItem.title}`}>
                                {subItem.icon && <subItem.icon className="h-4 w-4 text-slate-500" />}
                                <span>{subItem.title}</span>
                              </div>
                            ) : (
                              <a href={subItem.url} data-id={`sidebar-nav-main-subitem-${subItem.title}`}>
                                <span>{subItem.title}</span>
                              </a>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          // Default Single Item
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                data-id={`sidebar-nav-main-item-${item.title}`}
                onClick={item.onClick}
              >
                {item.icon && <item.icon className="text-slate-600" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
