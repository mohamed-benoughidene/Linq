"use client"

import React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBuilderStore } from "@/store/builder-store"
import { ThemeCard } from "@/components/builder/panels/theme-card"
import { THEMES } from "@/lib/themes"

export function ThemesPanel() {
    const { setActivePanel, currentTheme, setTheme } = useBuilderStore()

    return (
        <div className="h-full w-[218px] flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Themes</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-md"
                    onClick={() => setActivePanel('none')}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-4">
                    {THEMES.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            theme={theme}
                            isActive={currentTheme.id === theme.id}
                            onClick={() => setTheme(theme.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
