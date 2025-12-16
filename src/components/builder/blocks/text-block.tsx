"use client"

import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { GripHorizontal } from "lucide-react"

interface TextBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function TextBlock({ id, data }: TextBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { textTitle = "Title", textContent = "Add your text here..." } = data

    return (
        <div
            className="w-full h-full p-6 flex flex-col justify-center relative overflow-hidden shadow-sm group border"
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
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="h-4 w-4" />
            </div>

            <h3 className="font-bold text-lg mb-2 leading-tight">
                {textTitle}
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-80">
                {textContent}
            </p>
        </div>
    )
}
