"use client"

import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { GripHorizontal, Globe } from "lucide-react"

interface EmbedBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function EmbedBlock({ id, data }: EmbedBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { embedUrl } = data

    return (
        <div
            className={cn(
                "w-full h-full relative overflow-hidden shadow-sm group border outline-none",
                // @ts-ignore
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border
            }}
        >
            {/* Hidden Badge */}
            {/* @ts-ignore */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}
            {/* Visual Drag Handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm p-1 px-3 rounded-full text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-slate-100 shadow-sm">
                <GripHorizontal className="h-4 w-4" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Drag</span>
            </div>

            {/* Shield for Dragging (prevent iframe theft of mouse events) */}
            <div className="absolute inset-0 z-10 pointer-events-none group-hover:pointer-events-auto group-hover:bg-transparent" />

            {embedUrl ? (
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-none"
                    title="Embed"
                    sandbox="allow-scripts allow-same-origin allow-forms" // Security best practice
                    style={{ pointerEvents: 'none' }} // Disable interaction in builder
                />
            ) : (
                <div
                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                    style={{ backgroundColor: 'var(--theme-block-bg)', color: 'var(--theme-block-text)' }}
                >
                    <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.colors.card === '#ffffff' ? '#f1f5f9' : 'rgba(255,255,255,0.1)' }}
                    >
                        <Globe className="h-6 w-6 opacity-50" />
                    </div>
                    <div className="text-center px-4">
                        <p className="font-medium opacity-80">Setup Embed</p>
                        <p className="text-xs mt-1 max-w-[200px] opacity-60">Add your Typeform, Cal.com or other embed URL.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
