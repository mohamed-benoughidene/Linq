"use client"

import * as React from "react"
import {
  Command,
  LifeBuoy,
  Send,
  PackagePlus,
} from "lucide-react"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { AddBlockModal } from "@/components/builder/AddBlockModal"
import { useBuilderStore } from "@/store/builderStore"
import { BlockType, Block } from "@/types/builder"
import { toast } from "sonner"
import { ThemesSection } from "@/components/builder/ThemesSection"
import { MicroInteractionsSection } from "@/components/builder/MicroInteractionsSection"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
}

import { getContrastTextColor } from "@/lib/colorUtils"

function createDefaultBlock(type: BlockType): Block {
  const defaultBgColor = '#FFFFFF'
  return {
    id: crypto.randomUUID(),
    type,
    position: Date.now(),
    content: type === 'image' ? '' : '',
    styles: {
      fontSize: type === 'heading' ? 32 : 16,
      color: getContrastTextColor(defaultBgColor),
      backgroundColor: defaultBgColor,
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
    // Image block fields
    imageUrl: type === 'image' ? '' : undefined,
    imageDescription: type === 'image' ? '' : undefined,
    // Link block fields
    linkUrl: type === 'link' ? '' : undefined,
    linkText: type === 'link' ? '' : undefined,
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
              <SidebarMenuItem>
                <MicroInteractionsSection />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

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
