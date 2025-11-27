'use client'

import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Canvas } from "@/components/builder/Canvas"
import { HeaderActions } from "@/components/builder/HeaderActions"
import { PublishToggle } from "@/components/builder/PublishToggle"
import { useEffect } from "react"
import { useBuilderStore } from "@/store/builderStore"
import { PageRecord } from "@/types/database"

interface BuilderEditorProps {
    page: PageRecord
}

export function BuilderEditor({ page }: BuilderEditorProps) {
    const setCurrentPageId = useBuilderStore(state => state.setCurrentPageId)
    const setPageTitle = useBuilderStore(state => state.setPageTitle)

    // Initialize store with page data
    useEffect(() => {
        setCurrentPageId(page.id)
        setPageTitle(page.title)
        // Note: We are NOT loading blocks here yet as per Phase 3 plan.
        // This step is just about the toggle.
    }, [page.id, page.title, setCurrentPageId, setPageTitle])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <span className="font-semibold">{page.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PublishToggle pageId={page.id} initialIsPublished={page.is_published} />
                        <Separator orientation="vertical" className="h-4" />
                        <HeaderActions />
                    </div>
                </header>
                <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
                    <div className="flex-1 overflow-y-auto bg-muted/10">
                        <Canvas />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
