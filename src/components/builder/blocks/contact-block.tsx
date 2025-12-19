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
            className={cn(
                "w-full h-full p-6 flex flex-col relative overflow-hidden shadow-sm group border outline-none",
                // @ts-ignore
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
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

            {/* Hidden Badge */}
            {/* @ts-ignore */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}

            <h3 className="font-bold text-lg mb-4 text-center" style={{ color: 'var(--theme-block-text)' }}>Contact Me</h3>

            <form className="flex-1 flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1">
                    <Label className="text-xs" style={{ color: 'var(--theme-block-label)' }}>Name</Label>
                    <Input
                        placeholder="Your Name"
                        className=""
                        style={{
                            backgroundColor: currentTheme.type === 'modern' ? '#f8fafc' : 'transparent',
                            borderColor: currentTheme.colors.border,
                            color: 'var(--theme-block-text)',
                            borderWidth: currentTheme.styles.borderWidth,
                            borderRadius: `calc(${currentTheme.styles.borderRadius} - 4px)`
                        }}
                        readOnly // No interactive typing in builder usually
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs" style={{ color: 'var(--theme-block-label)' }}>Email</Label>
                    <Input
                        placeholder="your@email.com"
                        type="email"
                        className=""
                        style={{
                            backgroundColor: currentTheme.type === 'modern' ? '#f8fafc' : 'transparent',
                            borderColor: currentTheme.colors.border,
                            color: 'var(--theme-block-text)',
                            borderWidth: currentTheme.styles.borderWidth,
                            borderRadius: `calc(${currentTheme.styles.borderRadius} - 4px)`
                        }}
                        readOnly
                    />
                </div>
                <div className="space-y-1 flex-1">
                    <Label className="text-xs" style={{ color: 'var(--theme-block-label)' }}>Message</Label>
                    <Textarea
                        placeholder="Hello..."
                        className="resize-none h-20"
                        style={{
                            backgroundColor: currentTheme.type === 'modern' ? '#f8fafc' : 'transparent',
                            borderColor: currentTheme.colors.border,
                            color: 'var(--theme-block-text)',
                            borderWidth: currentTheme.styles.borderWidth,
                            borderRadius: `calc(${currentTheme.styles.borderRadius} - 4px)`
                        }}
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
