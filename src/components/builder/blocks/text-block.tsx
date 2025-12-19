"use client"

import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function TextBlock({ id, data }: TextBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { textTitle = "Title", textContent = "Add your text here..." } = data

    return (
        <div
            className={cn(
                "w-full h-full p-6 flex flex-col justify-center relative overflow-hidden shadow-sm group border outline-none",
                // @ts-ignore
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={{
                background: 'var(--theme-block-bg)',
                textAlign: 'var(--theme-block-align)' as React.CSSProperties['textAlign'],
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border,
                color: 'var(--theme-block-text)',
                borderWidth: currentTheme.styles.borderWidth,
                opacity: 'calc(1 - var(--theme-block-alpha))',
            }}
        >
            {/* Visual Drag Handle */}
            <div
                className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--theme-block-text)', opacity: 0.3 }}
            >
                <GripHorizontal className="h-4 w-4" />
            </div>

            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}

            <h3 className="font-bold text-lg mb-2 leading-tight">
                {textTitle}
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-80">
                {textContent}
            </p>
        </div>
    )
}
