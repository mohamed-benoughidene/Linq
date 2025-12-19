"use client"

import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { GripHorizontal, Instagram, Twitter, Linkedin, Github, Youtube, Globe } from "lucide-react"

interface SocialsBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function SocialsBlock({ id, data }: SocialsBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { socialLinks = [] } = data

    const getIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return <Instagram className="h-5 w-5" />
            case 'twitter': return <Twitter className="h-5 w-5" />
            case 'linkedin': return <Linkedin className="h-5 w-5" />
            case 'github': return <Github className="h-5 w-5" />
            case 'youtube': return <Youtube className="h-5 w-5" />
            default: return <Globe className="h-5 w-5" />
        }
    }

    return (
        <div
            className={cn(
                "w-full h-full p-4 flex flex-col justify-center relative overflow-hidden shadow-sm group border outline-none",
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
            <div
                className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--theme-block-text)', opacity: 0.3 }}
            >
                <GripHorizontal className="h-3.5 w-3.5" />
            </div>

            {/* Hidden Badge */}
            {/* @ts-ignore */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
                {socialLinks.length === 0 && (
                    <span className="text-sm text-slate-400 italic">Add social links...</span>
                )}

                {socialLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-10 w-10 rounded-full hover:scale-110 transition-transform duration-200"
                        style={{
                            backgroundColor: currentTheme.type === 'modern' ? '#f8fafc' : 'rgba(255,255,255,0.1)',
                            color: 'var(--theme-block-text)',
                            borderColor: currentTheme.colors.border,
                            borderWidth: currentTheme.styles.borderWidth,
                            borderStyle: 'solid'
                        }}
                        onClick={(e) => e.preventDefault()} // Prevent nav in builder
                    >
                        {getIcon(link.platform)}
                    </a>
                ))}
            </div>
        </div>
    )
}
