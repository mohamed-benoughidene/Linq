'use client'

import { useEffect } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Canvas } from "@/components/builder/Canvas"
import { ThemesSection } from "@/components/builder/ThemesSection"
// import { HeaderActions } from "@/components/builder/HeaderActions"
// import { AutoSaveManager } from "@/components/builder/AutoSaveManager"

export default function Page() {
  // const undo = useBuilderStore((state) => state.undo)
  // const redo = useBuilderStore((state) => state.redo)

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
  //       e.preventDefault()
  //       if (e.shiftKey) {
  //         redo()
  //       } else {
  //         undo()
  //       }
  //     }
  //   }

  //   window.addEventListener('keydown', handleKeyDown)
  //   return () => window.removeEventListener('keydown', handleKeyDown)
  // }, [undo, redo])

  return (
    <SidebarProvider>
      {/* <AutoSaveManager /> */}
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          {/* <HeaderActions /> */}
        </header>
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto bg-muted/10">
            <Canvas />
          </div>
          <aside className="w-80 border-l bg-background overflow-y-auto">
            <ThemesSection />
            <Separator />
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
