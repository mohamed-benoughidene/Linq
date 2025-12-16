"use client"

import { cn } from "@/lib/utils"
import { Grid, LayoutTemplate, Monitor, Smartphone, Square } from "lucide-react"

export type BlockVariant = 'icon' | 'square' | 'classic' | 'wide' | 'hero'

interface SizeSelectorProps {
    currentVariant: BlockVariant | string
    onSelect: (variant: BlockVariant) => void
    allowedVariants?: BlockVariant[]
}

export function SizeSelector({ currentVariant, onSelect, allowedVariants }: SizeSelectorProps) {
    // Define all possible variants with their labels and optional icons
    const variants: { id: BlockVariant; label: string; icon?: React.ReactNode }[] = [
        { id: 'icon', label: 'Icon', icon: <Smartphone className="h-3 w-3" /> },
        { id: 'square', label: 'Box', icon: <Square className="h-3 w-3" /> },
        { id: 'classic', label: 'Bar', icon: <LayoutTemplate className="h-3 w-3 rotate-180" /> }, // Visually similar to a bar
        { id: 'wide', label: 'Wide', icon: <Monitor className="h-3 w-3" /> }, // Placeholder icon
        { id: 'hero', label: 'Hero', icon: <Grid className="h-3 w-3" /> },
    ]

    // Filter based on allowedVariants if provided
    const visibleVariants = allowedVariants
        ? variants.filter(v => allowedVariants.includes(v.id))
        : variants

    return (
        <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Size</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {visibleVariants.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={cn(
                            "flex-1 py-1.5 rounded-md text-[10px] font-medium transition-all flex items-center justify-center gap-1",
                            currentVariant === option.id
                                ? "bg-white shadow-sm text-slate-900 ring-1 ring-black/5"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                        title={option.label}
                    >
                        {/* {option.icon} */}
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
