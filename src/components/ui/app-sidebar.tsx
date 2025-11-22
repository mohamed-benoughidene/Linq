"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  PackagePlus,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { AddBlockModal } from "@/components/builder/AddBlockModal"
import { useBuilderStore } from "@/store/builderStore"
import { BlockType, Block } from "@/types/builder"
import { toast } from "sonner"
import { ThemesSection } from "@/components/builder/ThemesSection"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

function createDefaultBlock(type: BlockType): Block {
  return {
    id: crypto.randomUUID(),
    type,
    position: Date.now(),
    content: type === 'image' ? 'https://via.placeholder.com/400x300' : '',
    styles: {
      fontSize: type === 'heading' ? 32 : 16,
      color: '#000000',
      margin: 8,
      padding: 8,
    },
    microInteractions: {
      hover: '',
      click: '',
      scroll: '',
    },
    themeLocked: false,
    microInteractionsLocked: false,
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [addBlockModalOpen, setAddBlockModalOpen] = React.useState(false)
  const { addBlock } = useBuilderStore()

  const handleSelectBlock = (type: BlockType) => {
    const newBlock = createDefaultBlock(type)
    addBlock(newBlock)
    toast.success('Block added', {
      description: `${type} block added to canvas`,
    })
  }

  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* Add Blocks Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Add Blocks</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setAddBlockModalOpen(true)}>
                  <PackagePlus className="h-4 w-4" />
                  <span>Static Blocks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Themes Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Design</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <ThemesSection />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      <AddBlockModal
        open={addBlockModalOpen}
        onOpenChange={setAddBlockModalOpen}
        onSelectBlock={handleSelectBlock}
      />
    </>
  )
}
