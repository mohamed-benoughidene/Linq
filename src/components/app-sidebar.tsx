"use client"

import * as React from "react"
import {
  BarChart2,
  Frame,
  Layers,
  LifeBuoy,
  Palette,
  Send,
  Settings2,
  Plus
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "My Personal Page",
      logo: Frame,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Links",
      url: "#",
      icon: Layers,
      isActive: true,
    },
    {
      title: "Appearance",
      url: "#",
      icon: Palette,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart2,
    },
    {
      title: "Page Settings",
      url: "#",
      icon: Settings2,
    },
  ],
  support: [
    {
      name: "Help Center",
      url: "#",
      icon: LifeBuoy,
    },
    {
      name: "Send Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} data-id="sidebar-app-container">
      <SidebarHeader className="border-b border-slate-200">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.support} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
