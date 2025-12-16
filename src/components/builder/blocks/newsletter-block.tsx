"use client"

import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, GripHorizontal } from "lucide-react"

interface NewsletterBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function NewsletterBlock({ id, data }: NewsletterBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { placeholderText = "your@email.com", buttonText = "Join" } = data

    return (
        <div
            className="w-full h-full p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-sm border"
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border
            }}
        >
            {/* Visual Drag Handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-300">
                <GripHorizontal className="h-4 w-4" />
            </div>

            <form
                className="flex w-full gap-2 items-center mt-2"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="relative flex-1">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        type="email"
                        placeholder={placeholderText}
                        className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-300"
                        style={{ borderRadius: `calc(${currentTheme.styles.borderRadius} - 4px)` }}
                        readOnly // Prevent typing in builder
                    />
                </div>
                <Button
                    type="submit"
                    className="h-10 px-6 font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                    style={{
                        backgroundColor: 'var(--theme-block-btn-bg)',
                        color: 'var(--theme-block-btn-text)',
                        borderRadius: `calc(${currentTheme.styles.borderRadius} - 4px)`
                    }}
                >
                    {buttonText}
                </Button>
            </form>

            {/* Click shield for the button to prevent actual submission/navigation in builder if needed, 
                though strict preventingDefault on form usually suffices. 
                But for dragging, let's ensure the whole block is draggable by not stopping propagation too aggressively.
                Actually, dragging is handled by the parent wrapper in block-renderer. 
            */}
        </div>
    )
}
