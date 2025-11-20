'use client'

import { useBuilderStore } from '@/store/builderStore'
import { predefinedThemes } from '@/lib/themes'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function ThemesSection() {
    const globalTheme = useBuilderStore((state) => state.globalTheme)
    const applyGlobalTheme = useBuilderStore((state) => state.applyGlobalTheme)

    return (
        <div className="p-4 space-y-4">
            <div>
                <h3 className="font-semibold mb-2">Themes</h3>
                <p className="text-sm text-muted-foreground">
                    Apply a theme to all unlocked blocks
                </p>
            </div>

            <div className="space-y-2">
                {predefinedThemes.map((theme) => (
                    <Button
                        key={theme.name}
                        variant={globalTheme.name === theme.name ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => applyGlobalTheme(theme)}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex gap-1">
                                <div
                                    className="w-4 h-4 rounded-sm border"
                                    style={{ backgroundColor: theme.colors.primary }}
                                />
                                <div
                                    className="w-4 h-4 rounded-sm border"
                                    style={{ backgroundColor: theme.colors.text }}
                                />
                                <div
                                    className="w-4 h-4 rounded-sm border"
                                    style={{ backgroundColor: theme.colors.accent }}
                                />
                            </div>
                            <span className="capitalize">{theme.name}</span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    )
}
