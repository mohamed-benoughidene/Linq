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
            className="w-full h-full p-4 flex flex-col justify-center relative overflow-hidden shadow-sm group border"
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border
            }}
        >
            {/* Visual Drag Handle */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="h-3.5 w-3.5" />
            </div>

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
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-50 text-slate-700 hover:scale-110 transition-transform duration-200 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                        style={{
                            // Use theme styling or clean minimalist? User asked for hover:scale-110, premium feel.
                            // Let's stick to clean slate colors but possibly use primary color on hover?
                            // For now, neutral is safe and premium.
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
