"use client"

import { BuilderCanvas } from "@/components/builder/builder-canvas"

import { useBuilderStore } from "@/store/builder-store"

import { AnalyticsView } from "@/components/dashboard/analytics-view"
import { TopBar } from "@/components/builder/top-bar"
import { cn } from "@/lib/utils"
// Removed CreatePageDialog and useState

export default function Page() {
  const { currentTheme, view, pages, activePageId, isPreview } = useBuilderStore()
  const activePage = pages.find(p => p.id === activePageId)
  // Local state for Create Page removed, now global

  // For analytics view, we want a clean slate background, not the user's theme
  const isEditor = view === 'editor'

  return (
    <div className="flex flex-1 flex-col h-full bg-slate-50 relative">
      {isEditor && (
        <>
          {isPreview ? (
            <div className="absolute top-4 right-4 z-50 pointer-events-auto">
              <TopBar />
            </div>
          ) : (
            <header
              className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-4 bg-white"
              style={{
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }}
            >
              <TopBar />
            </header>
          )}
        </>
      )}

      {isEditor ? (
        <>
          <div
            className={cn(
              "flex flex-1 flex-col overflow-auto duration-300 ease-in-out",
              isPreview ? "items-center bg-slate-100/50 py-12 px-4" : "p-4"
            )}
            style={!isPreview ? { backgroundColor: currentTheme.colors.background } : undefined}
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
