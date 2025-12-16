"use client"

import { BuilderCanvas } from "@/components/builder/builder-canvas"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useBuilderStore } from "@/store/builder-store"

export default function Page() {
  const { currentTheme } = useBuilderStore()

  return (
    <div className="flex flex-1 flex-col h-full">
      <header
        className="flex h-12 shrink-0 items-center gap-2 px-4 transition-colors duration-300 ease-in-out z-10"
        style={{
          backgroundColor: currentTheme.colors.background,
          color: currentTheme.colors.text // Also apply text color so icon matches theme
        }}
      >
        <SidebarTrigger className="-ml-1" />
      </header>
      <div
        className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto transition-colors duration-300 ease-in-out"
        style={{ backgroundColor: currentTheme.colors.background }} // Extend bg to the wrapper too so gaps are covered
      >
        <BuilderCanvas />
      </div>
    </div>
  )
}
