"use client"

import { BuilderCanvas } from "@/components/builder/builder-canvas"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useBuilderStore } from "@/store/builder-store"

import { AnalyticsView } from "@/components/dashboard/analytics-view"
import { TopBar } from "@/components/builder/top-bar"
// Removed CreatePageDialog and useState

export default function Page() {
  const { currentTheme, view } = useBuilderStore()
  // Local state for Create Page removed, now global

  // For analytics view, we want a clean slate background, not the user's theme
  const isEditor = view === 'editor'

  return (
    <div className="flex flex-1 flex-col h-full bg-slate-50">
      <header
        className="flex h-12 shrink-0 items-center justify-between gap-2 px-4 transition-colors duration-300 ease-in-out z-10"
        style={isEditor ? {
          backgroundColor: currentTheme.colors.background,
          color: currentTheme.colors.text
        } : undefined}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>

        {isEditor && (
          <TopBar />
        )}
      </header>

      {isEditor ? (
        <>
          <div
            className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto transition-colors duration-300 ease-in-out"
            style={{ backgroundColor: currentTheme.colors.background }}
          >
            <BuilderCanvas />
          </div>
        </>
      ) : (
        <AnalyticsView />
      )}
    </div>
  )
}
