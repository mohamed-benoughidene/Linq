"use client"

import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { GripHorizontal, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ContactBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function ContactBlock({ id, data }: ContactBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { submitButtonText = "Send Message", contactEmail } = data

    return (
        <div
            className="w-full h-full p-6 flex flex-col relative overflow-hidden shadow-sm group border"
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border
            }}
        >
            {/* Visual Drag Handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="h-4 w-4" />
            </div>

            <h3 className="font-bold text-lg mb-4 text-center" style={{ color: 'var(--theme-block-text)' }}>Contact Me</h3>

            <form className="flex-1 flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1">
                    <Label className="text-xs" style={{ color: 'var(--theme-block-label)' }}>Name</Label>
                    <Input
                        placeholder="Your Name"
                        className="bg-slate-50 border-slate-200"
                        readOnly // No interactive typing in builder usually
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs" style={{ color: 'var(--theme-block-label)' }}>Email</Label>
                    <Input
                        placeholder="your@email.com"
                        type="email"
                        className="bg-slate-50 border-slate-200"
                        readOnly
                    />
                </div>
                <div className="space-y-1 flex-1">
                    <Label className="text-xs" style={{ color: 'var(--theme-block-label)' }}>Message</Label>
                    <Textarea
                        placeholder="Hello..."
                        className="bg-slate-50 border-slate-200 resize-none h-20"
                        readOnly
                    />
                </div>

                <Button
                    className="w-full gap-2 mt-2"
                    style={{
                        backgroundColor: 'var(--theme-block-btn-bg)',
                        color: 'var(--theme-block-btn-text)',
                        borderRadius: `calc(${currentTheme.styles.borderRadius} - 4px)`
                    }}
                >
                    <Send className="h-4 w-4" />
                    {submitButtonText}
                </Button>
            </form>
        </div>
    )
}
