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
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { addBlock, togglePanel, activePanel } = useBuilderStore()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="tracking-tight">Builder</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Special Case: "Links" (Action Button)
          if (item.title === "Links") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  data-id={`sidebar-nav-main-item-${item.title}`}
                  onClick={() => addBlock('link')}
                >
                  {item.icon && <item.icon className="text-slate-600" />}
                  <span>{item.title}</span>
                  <Plus className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Special Case: "Appearance" (Themes Panel Toggle)
          if (item.title === "Appearance") {
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
                  onClick={() => togglePanel('settings')}
                  isActive={isActive}
                  className={isActive ? "text-violet-600 bg-violet-50 hover:bg-violet-100 hover:text-violet-700" : ""}
                >
                  {item.icon && <item.icon className={isActive ? "text-violet-600" : "text-slate-600"} />}
                  <span className={isActive ? "font-medium" : ""}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Default: Collapsible Menu (e.g. Analytics)
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
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url} data-id={`sidebar-nav-main-subitem-${subItem.title}`}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
