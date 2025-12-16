"use client"

import React from "react"
import { X, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useBuilderStore } from "@/store/builder-store"
import { ThemeCard } from "@/components/builder/panels/theme-card"
import { BackgroundPicker } from "@/components/builder/editors/background-picker"
import { THEMES } from "@/lib/themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemesPanel() {
    const { setActivePanel, currentTheme, setTheme, updateThemeProperty } = useBuilderStore()
    const [activeTab, setActiveTab] = React.useState("presets")

    const handlePresetSelect = (themeId: string) => {
        const theme = THEMES.find(t => t.id === themeId)
        if (theme) {
            setTheme(theme)
        }
    }

    return (
        <div className="h-full w-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Design</h2>
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
            <div className="flex-1 flex flex-col min-h-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                    <div className="px-4 pt-4">
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="presets">Presets</TabsTrigger>
                            <TabsTrigger value="customize">Customize</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="presets" className="flex-1 min-h-0 overflow-y-auto p-4 mt-0">
                        <div className="grid grid-cols-1 gap-4">
                            {THEMES.map((theme) => (
                                <ThemeCard
                                    key={theme.id}
                                    theme={theme}
                                    isActive={currentTheme.id === theme.id}
                                    onClick={() => handlePresetSelect(theme.id)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="customize" className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 mt-0">
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Background</h3>

                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs">Type</Label>
                                    <Select
                                        value={currentTheme.styles.backgroundType || 'solid'}
                                        onValueChange={(val: 'solid' | 'gradient' | 'image') => {
                                            updateThemeProperty('styles', 'backgroundType', val)
                                            // Optional: Set default values when switching types if needed
                                            if (val === 'solid') updateThemeProperty('colors', 'background', '#ffffff')
                                            if (val === 'gradient') updateThemeProperty('colors', 'background', 'linear-gradient(to right, #ff7e5f, #feb47b)')
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="solid">Solid Color</SelectItem>
                                            <SelectItem value="gradient">Gradient</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <BackgroundPicker
                                    mode={currentTheme.styles.backgroundType === 'gradient' ? 'gradient' : 'solid'}
                                    value={currentTheme.colors.background}
                                    onChange={(bg) => updateThemeProperty('colors', 'background', bg)}
                                />
                            </div>
                        </div>

                        {/* Typography Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Typography</h3>
                            <div className="space-y-2">
                                <Label className="text-xs">Font Pairing</Label>
                                <Select
                                    value={currentTheme.styles.fontFamily}
                                    onValueChange={(val: string) => updateThemeProperty('styles', 'fontFamily', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Inter, sans-serif">Inter (Modern)</SelectItem>
                                        <SelectItem value="'Space Mono', monospace">Space Mono (Retro)</SelectItem>
                                        <SelectItem value="'Times New Roman', serif">Serif (Classic)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                        {/* Block Appearance Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Block Appearance</h3>

                            <div className="space-y-3">
                                {/* Block Background Color */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Block Background</Label>

                                    <div className="space-y-3">
                                        <Select
                                            value={currentTheme.styles.blockBackgroundType || 'solid'}
                                            onValueChange={(val: 'solid' | 'gradient') => {
                                                updateThemeProperty('styles', 'blockBackgroundType', val)
                                                // Optional defaults
                                                if (val === 'solid') updateThemeProperty('styles', 'blockBackgroundColor', '#ffffff')
                                                if (val === 'gradient') updateThemeProperty('styles', 'blockBackgroundColor', 'linear-gradient(to right, #4facfe, #00f2fe)')
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="solid">Solid Color</SelectItem>
                                                <SelectItem value="gradient">Gradient</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <BackgroundPicker
                                            mode={currentTheme.styles.blockBackgroundType === 'gradient' ? 'gradient' : 'solid'}
                                            value={currentTheme.styles.blockBackgroundColor || '#ffffff'}
                                            onChange={(bg) => updateThemeProperty('styles', 'blockBackgroundColor', bg)}
                                        />
                                    </div>
                                </div>

                                {/* Block Text Color */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Block Text</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full border border-slate-200 overflow-hidden relative">
                                            <Input
                                                type="color"
                                                value={currentTheme.styles.blockTextColor || '#000000'}
                                                onChange={(e) => updateThemeProperty('styles', 'blockTextColor', e.target.value)}
                                                className="absolute inset-0 p-0 h-full w-full opacity-0 cursor-pointer"
                                            />
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{ backgroundColor: currentTheme.styles.blockTextColor || '#000000' }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500 uppercase">{currentTheme.styles.blockTextColor || '#000000'}</span>
                                    </div>
                                </div>

                                {/* Label Color */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Label Color</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full border border-slate-200 overflow-hidden relative">
                                            <Input
                                                type="color"
                                                value={currentTheme.styles.blockLabelColor || '#64748b'} // Default slate-500
                                                onChange={(e) => updateThemeProperty('styles', 'blockLabelColor', e.target.value)}
                                                className="absolute inset-0 p-0 h-full w-full opacity-0 cursor-pointer"
                                            />
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{ backgroundColor: currentTheme.styles.blockLabelColor || '#64748b' }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500 uppercase">{currentTheme.styles.blockLabelColor || '#64748b'}</span>
                                    </div>
                                </div>

                                {/* Button Colors */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Button Bg</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full border border-slate-200 overflow-hidden relative">
                                                <Input
                                                    type="color"
                                                    value={currentTheme.styles.blockButtonBg || '#000000'}
                                                    onChange={(e) => updateThemeProperty('styles', 'blockButtonBg', e.target.value)}
                                                    className="absolute inset-0 p-0 h-full w-full opacity-0 cursor-pointer"
                                                />
                                                <div
                                                    className="absolute inset-0 pointer-events-none"
                                                    style={{ backgroundColor: currentTheme.styles.blockButtonBg || '#000000' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Button Text</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full border border-slate-200 overflow-hidden relative">
                                                <Input
                                                    type="color"
                                                    value={currentTheme.styles.blockButtonText || '#ffffff'}
                                                    onChange={(e) => updateThemeProperty('styles', 'blockButtonText', e.target.value)}
                                                    className="absolute inset-0 p-0 h-full w-full opacity-0 cursor-pointer"
                                                />
                                                <div
                                                    className="absolute inset-0 pointer-events-none"
                                                    style={{ backgroundColor: currentTheme.styles.blockButtonText || '#ffffff' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transparency */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs">Transparency</Label>
                                        <span className="text-xs text-slate-500">{(currentTheme.styles.blockTransparency || 0) * 100}%</span>
                                    </div>
                                    <Slider
                                        value={[currentTheme.styles.blockTransparency || 0]}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        onValueChange={(val: number[]) => {
                                            updateThemeProperty('styles', 'blockTransparency', val[0])
                                        }}
                                    />
                                </div>

                                {/* Alignment */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Content Alignment</Label>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => updateThemeProperty('styles', 'blockAlign', 'left')}
                                            className={cn(
                                                "flex-1 flex items-center justify-center py-1.5 rounded-md text-slate-500 transition-all",
                                                (currentTheme.styles.blockAlign === 'left' || !currentTheme.styles.blockAlign) && "bg-white text-slate-900 shadow-sm"
                                            )}
                                        >
                                            <AlignLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => updateThemeProperty('styles', 'blockAlign', 'center')}
                                            className={cn(
                                                "flex-1 flex items-center justify-center py-1.5 rounded-md text-slate-500 transition-all",
                                                currentTheme.styles.blockAlign === 'center' && "bg-white text-slate-900 shadow-sm"
                                            )}
                                        >
                                            <AlignCenter className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => updateThemeProperty('styles', 'blockAlign', 'right')}
                                            className={cn(
                                                "flex-1 flex items-center justify-center py-1.5 rounded-md text-slate-500 transition-all",
                                                currentTheme.styles.blockAlign === 'right' && "bg-white text-slate-900 shadow-sm"
                                            )}
                                        >
                                            <AlignRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Border Radius */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs">Roundness</Label>
                                        <span className="text-xs text-slate-500">{currentTheme.styles.borderRadius}</span>
                                    </div>
                                    <Slider
                                        value={[parseInt(currentTheme.styles.borderRadius) || 0]}
                                        min={0}
                                        max={50}
                                        step={1}
                                        onValueChange={(val: number[]) => {
                                            updateThemeProperty('styles', 'borderRadius', `${val[0]}px`)
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Label className="text-xs">Button Style (Outline)</Label>
                                    <Switch
                                        checked={currentTheme.styles.buttonStyle === 'outline'}
                                        onCheckedChange={(checked) =>
                                            updateThemeProperty('styles', 'buttonStyle', checked ? 'outline' : 'solid')
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
