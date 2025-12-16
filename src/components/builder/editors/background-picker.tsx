"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface BackgroundPickerProps {
    value: string
    onChange: (value: string) => void
    mode: 'solid' | 'gradient'
}

const GRADIENT_PRESETS = [
    { name: "Sunset", value: "linear-gradient(to right, #ff7e5f, #feb47b)" },
    { name: "Ocean", value: "linear-gradient(to right, #2b5876, #4e4376)" },
    { name: "Mint", value: "linear-gradient(to right, #00b09b, #96c93d)" },
    { name: "Berry", value: "linear-gradient(to right, #833ab4, #fd1d1d)" },
    { name: "Dusk", value: "linear-gradient(to right, #cc2b5e, #753a88)" },
    { name: "Morning", value: "linear-gradient(to right, #56ab2f, #a8e063)" },
]

export function BackgroundPicker({ value, onChange, mode }: BackgroundPickerProps) {
    // State for custom gradient generator
    const [startColor, setStartColor] = useState("#ffffff")
    const [endColor, setEndColor] = useState("#000000")

    const handleSolidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    const handleCustomGradientChange = (type: 'start' | 'end', color: string) => {
        if (type === 'start') setStartColor(color)
        else setEndColor(color)

        const newStart = type === 'start' ? color : startColor
        const newEnd = type === 'end' ? color : endColor

        onChange(`linear-gradient(135deg, ${newStart}, ${newEnd})`)
    }

    if (mode === 'solid') {
        const isGradient = value.startsWith("linear-gradient")

        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-full rounded-md border border-slate-200 overflow-hidden relative">
                        <Input
                            type="color"
                            value={!isGradient ? value : "#ffffff"}
                            onChange={handleSolidChange}
                            className="absolute inset-0 p-0 h-full w-full opacity-0 cursor-pointer"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ backgroundColor: !isGradient ? value : "#ffffff" }}
                        />
                    </div>
                    <div className="w-24 text-xs font-mono border border-slate-200 rounded px-2 py-2 text-center text-slate-500 bg-slate-50">
                        {!isGradient ? value : "---"}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Presets Grid */}
            <div className="space-y-2">
                <Label className="text-xs">Presets</Label>
                <div className="grid grid-cols-6 gap-2">
                    {GRADIENT_PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            className={cn(
                                "h-8 w-8 rounded-full border border-slate-200 shadow-sm transition-all hover:scale-110",
                                value === preset.value && "ring-2 ring-violet-500 ring-offset-2"
                            )}
                            style={{ background: preset.value }}
                            onClick={() => onChange(preset.value)}
                            title={preset.name}
                        />
                    ))}
                </div>
            </div>

            {/* Custom Generator */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-xs">Custom Gradient</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">Start</span>
                        <div className="h-8 w-full rounded-md border border-slate-200 overflow-hidden relative">
                            <Input
                                type="color"
                                value={startColor}
                                onChange={(e) => handleCustomGradientChange('start', e.target.value)}
                                className="absolute inset-0 p-0 h-full w-full opacity-0 cursor-pointer"
                            />
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ backgroundColor: startColor }}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">End</span>
                        <div className="h-8 w-full rounded-md border border-slate-200 overflow-hidden relative">
                            <Input
                                type="color"
                                value={endColor}
                                onChange={(e) => handleCustomGradientChange('end', e.target.value)}
                                className="absolute inset-0 p-0 h-full w-full opacity-0 cursor-pointer"
                            />
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ backgroundColor: endColor }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
