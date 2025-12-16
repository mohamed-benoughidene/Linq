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
  Plus,
  Link2,
  User as UserCircle, // Changed to User for consistency or import UserCircle if available. Lucide has User.
  Video,
  Music,
  Image as ImageIcon,
  Clock, // Timer icon
  Mail,   // Newsletter icon
  Type,   // Text icon
  MapPin, // Map icon
  Share2, // Socials icon
  MessageSquare, // Contact icon
  CalendarClock, // Calendly icon
  Globe // Embed icon
} from "lucide-react"

import { useBuilderStore } from "@/store/builder-store"
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
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { addBlock, setActivePanel, openSupport } = useBuilderStore()

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
        title: "Blocks",
        url: "#",
        icon: Layers,
        isActive: true, // Default open
        items: [
          {
            title: "Link",
            url: "#",
            icon: Link2, // We need to import Link2
            onClick: () => addBlock('link')
          },
          {
            title: "Header / Bio",
            url: "#",
            icon: UserCircle, // We need to import UserCircle
            onClick: () => addBlock('header')
          },
          {
            title: "Video",
            url: "#",
            icon: Video, // We need to import Video
            onClick: () => addBlock('video')
          },
          {
            title: "Audio",
            url: "#",
            icon: Music, // We need to import Music
            onClick: () => addBlock('audio')
          },
          {
            title: "Gallery",
            url: "#",
            icon: ImageIcon,
            onClick: () => addBlock('gallery')
          },
          {
            title: "Newsletter",
            url: "#",
            icon: Mail,
            onClick: () => addBlock('newsletter')
          },
          {
            title: "Timer",
            url: "#",
            icon: Clock,
            onClick: () => addBlock('timer')
          },
          {
            title: "Text",
            url: "#",
            icon: Type,
            onClick: () => addBlock('text')
          },
          {
            title: "Map",
            url: "#",
            icon: MapPin,
            onClick: () => addBlock('map')
          },
          {
            title: "Socials",
            url: "#",
            icon: Share2,
            onClick: () => addBlock('socials')
          },
          {
            title: "Contact Form",
            url: "#",
            icon: MessageSquare,
            onClick: () => addBlock('contact')
          },
          {
            title: "Calendly",
            url: "#",
            icon: CalendarClock,
            onClick: () => addBlock('calendly')
          },
          {
            title: "Embed / Iframe",
            url: "#",
            icon: Globe,
            onClick: () => addBlock('embed')
          }
        ]
      },
      {
        title: "Theme",
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
        onClick: () => setActivePanel('settings')
      },
    ],
    support: [
      {
        name: "Support & Feedback",
        url: "#",
        icon: Send,
        onClick: () => openSupport()
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props} data-id="sidebar-app-container">
      <SidebarHeader className="border-b border-slate-200">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain as any} />
        {/* Type cast needed because LucideIcon type mismatch sometimes or optional properties */}
        <NavProjects projects={data.support} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
