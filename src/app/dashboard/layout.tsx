"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useBuilderStore } from "@/store/builder-store"
import { ThemesPanel } from "@/components/builder/panels/themes-panel"
import { SettingsPanel } from "@/components/builder/panels/settings-panel"
import { BlocksPanel } from "@/components/builder/panels/blocks-panel"
import { SidebarSync } from "@/components/dashboard/sidebar-sync"
import { SupportDialog } from "@/components/dashboard/support-dialog"
import { CreatePageDialog } from "@/components/dashboard/modals/create-page-dialog"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { activePanel } = useBuilderStore()

    // Determine panel width
    // If activePanel is 'none', width is 0.
    // settings: 20rem (320px), blocks: 240px, themes: 16rem (256px)
    // settings: 20rem (320px), blocks: 16rem (256px), themes: 16rem (256px)
    const panelWidth = activePanel === 'settings' ? '20rem'
        : activePanel === 'blocks' || activePanel === 'themes' ? '16rem'
            : '0px'

    return (
        <SidebarProvider defaultOpen={true}>
            <SidebarSync />
            <SupportDialog />
            <CreatePageDialog />
            <div className="flex h-screen w-full overflow-hidden bg-slate-50">
                {/* Column 1: Main Nav (Fixed Sidebar) */}
                <div className="z-20 h-full flex-shrink-0">
                    <AppSidebar />
                </div>

                {/* Column 2: Flyout Panel */}
                <div
                    className={cn(
                        "z-10 h-full bg-white border-r border-slate-200 overflow-hidden transition-[width] duration-300 ease-in-out relative flex-shrink-0",
                        // Using style for width to allow 0px
                    )}
                    style={{ width: panelWidth }}
                    data-id="flyout-panel"
                >
                    {activePanel === 'themes' && <ThemesPanel />}
                    {activePanel === 'settings' && <SettingsPanel />}
                    <BlocksPanel />
                </div>

                {/* Column 3: Canvas Stage (Main Content) */}
                <div className="flex-1 relative h-full overflow-hidden transition-all duration-300">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}
