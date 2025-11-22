'use client'

import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'
import { themes } from '@/lib/themes'
import { useBuilderStore } from '@/store/builderStore'
import { toast } from 'sonner'

export function ThemesSection() {
    const { applyGlobalTheme } = useBuilderStore()
    const [selectedTheme, setSelectedTheme] = useState<string>('minimal')

    const handleApplyTheme = () => {
        const theme = themes[selectedTheme]
        if (!theme) return

        applyGlobalTheme(theme)
        toast.success('Theme applied', {
            description: `${theme.name} theme applied to all unlocked blocks`,
        })
    }

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                    <Palette className="mr-2 h-4 w-4" />
                    Themes
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub className="px-4 py-2">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {Object.entries(themes).map(([key, theme]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedTheme(key)}
                                className={`theme-card border rounded p-3 hover:border-primary transition-colors ${selectedTheme === key ? 'border-primary bg-accent' : ''
                                    }`}
                            >
                                <div className="flex gap-1 mb-2">
                                    <div
                                        className="h-3 w-3 rounded-full border"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    />
                                    <div
                                        className="h-3 w-3 rounded-full border"
                                        style={{ backgroundColor: theme.colors.accent }}
                                    />
                                    <div
                                        className="h-3 w-3 rounded-full border"
                                        style={{ backgroundColor: theme.colors.text }}
                                    />
                                </div>
                                <span className="text-xs font-medium">{theme.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* APPLY BUTTON: Expensive operation requires user confirmation */}
                    <Button
                        onClick={handleApplyTheme}
                        className="w-full"
                        size="sm"
                    >
                        Apply Theme
                    </Button>
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )
}
