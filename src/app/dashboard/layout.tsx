"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useBuilderStore } from "@/store/builder-store"
import { ThemesPanel } from "@/components/builder/panels/themes-panel"
import { SidebarSync } from "@/components/dashboard/sidebar-sync"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { activePanel } = useBuilderStore()

    // Determine panel width
    // If activePanel is 'none', width is 0.
    // Otherwise it's 218px (approx 15% less than 16rem/256px sidebar).
    const panelWidth = activePanel === 'none' ? '0px' : '218px'

    return (
        <SidebarProvider defaultOpen={true}>
            <SidebarSync />
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
                >
                    <ThemesPanel />
                </div>

                {/* Column 3: Canvas Stage (Main Content) */}
                <div className="flex-1 relative h-full overflow-hidden transition-all duration-300">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}
