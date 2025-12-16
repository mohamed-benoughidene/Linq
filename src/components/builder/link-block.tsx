"use client"

import { useRef } from "react"
import {
    Link2,
    Globe,
    Instagram,
    Twitter,
    Github,
    Linkedin,
    Youtube,
    Facebook,
    Mail,
    Phone,
    Music,
    Video,
    Image as ImageIcon,
    Link as LinkIcon,
    User
} from "lucide-react"
import { useBuilderStore } from "@/store/builder-store"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LinkBlockProps {
    id: string
    data: {
        title: string
        url: string
        isActive: boolean
        thumbnail?: string
        variant?: 'icon' | 'square' | 'classic' | 'wide' | 'hero'
        highlight?: boolean
        items?: { id: string; title: string; url: string; icon?: string }[]
    }
    layout?: { i: string; x: number; y: number; w: number; h: number }
}

const ICON_MAP: Record<string, React.FC<any>> = {
    "Globe": Globe,
    "Instagram": Instagram,
    "Twitter": Twitter,
    "Github": Github,
    "Linkedin": Linkedin,
    "Youtube": Youtube,
    "Facebook": Facebook,
    "Mail": Mail,
    "Phone": Phone,
    "Music": Music,
    "Video": Video,
    "Image": ImageIcon,
    "Link": LinkIcon,
    "User": User
}

export function LinkBlock({ id, data, layout }: LinkBlockProps) {
    const { currentTheme } = useBuilderStore()
    const containerRef = useRef<HTMLDivElement>(null)

    const variant = data.variant || 'classic'

    // Helper to render thumbnail (Icon or Emoji fallback)
    const renderThumbnail = (iconName?: string, className?: string) => {
        if (!iconName) {
            const isLarge = variant === 'square' || variant === 'hero'
            const sizeClass = isLarge ? "h-10 w-10" : "h-6 w-6"
            return <Link2 className={cn("text-slate-300", sizeClass)} strokeWidth={1.5} />
        }

        const IconComponent = ICON_MAP[iconName]
        if (IconComponent) {
            return <IconComponent className={className || "h-4 w-4"} />
        }

        // Fallback for emojis
        return <span className={cn("text-lg leading-none", className)}>{iconName}</span>
    }

    const isSimpleLayout = variant === 'classic' || variant === 'icon'

    // --- Content Rendering ---
    const renderContent = () => {
        // Base Dynamic Styles
        const baseStyles: React.CSSProperties = {
            background: 'var(--theme-block-bg)',
            color: 'var(--theme-block-text)',
            borderColor: currentTheme.colors.border,
            borderWidth: currentTheme.styles.borderWidth,
            borderRadius: 'var(--theme-radius)',
            boxShadow: currentTheme.styles.shadow,
            fontFamily: currentTheme.styles.fontFamily,
            textAlign: 'var(--theme-block-align)' as any,
            opacity: 'calc(1 - var(--theme-block-alpha))',
        }

        const isRetro = currentTheme.type === 'retro'
        const retroHoverClass = isRetro ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75" : "hover:scale-[1.01] hover:shadow-md transition-all duration-200"

        if (variant === 'icon') {
            return (
                <div
                    className={cn(
                        "w-full h-full flex items-center justify-center border outline-none",
                        retroHoverClass,
                        !isRetro && "group-hover:border-slate-400 group-hover:shadow-md",
                        data.highlight && "ring-2 ring-violet-500 ring-offset-2",
                        data.highlight && "animate-pulse"
                    )}
                    style={baseStyles}
                >
                    {renderThumbnail(data.thumbnail, "h-6 w-6")}

                    {!data.isActive && (
                        <div className="absolute -top-1 -right-1 z-20 pointer-events-none">
                            <Badge variant="secondary" className="text-[8px] px-1 h-3.5 bg-slate-100 border-slate-200">Hidden</Badge>
                        </div>
                    )}
                </div>
            )
        }

        if (!isSimpleLayout) {
            // Square/Wide/Hero Variants
            return (
                <div
                    className={cn(
                        "w-full h-full relative overflow-hidden border flex flex-col justify-end p-4 outline-none",
                        retroHoverClass,
                        !isRetro && "group-hover:border-slate-400 group-hover:shadow-md",
                        data.highlight && "ring-2 ring-violet-500 ring-offset-2",
                        data.highlight && "animate-pulse"
                    )}
                    style={baseStyles}
                >
                    {/* Background */}
                    <div className="absolute inset-0 z-0">
                        {data.thumbnail && ICON_MAP[data.thumbnail] ? (
                            <>
                                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center opacity-10">
                                    {renderThumbnail(data.thumbnail, "h-full w-full p-8")}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full pointer-events-none">
                        <div className="mb-2 filter drop-shadow-sm select-none">
                            {renderThumbnail(data.thumbnail, "h-6 w-6")}
                        </div>
                        <span className="block text-sm font-semibold tracking-tight leading-tight truncate w-full">
                            {data.title || <span className="text-slate-400 italic font-normal">Empty Link</span>}
                        </span>
                    </div>

                    {!data.isActive && (
                        <div className="absolute top-2 left-2 z-20 pointer-events-none">
                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-slate-100/80 backdrop-blur-sm border-slate-200 shadow-sm text-slate-500">Hidden</Badge>
                        </div>
                    )}
                </div>
            )
        }

        // Classic (Bar) Variant
        return (
            <div
                className={cn(
                    "w-full h-full p-4 border flex items-center gap-4 outline-none",
                    retroHoverClass,
                    !isRetro && "group-hover:border-slate-400 group-hover:shadow-md",
                    data.highlight && "ring-2 ring-violet-500 ring-offset-2",
                    data.highlight && "animate-pulse"
                )}
                style={baseStyles}
            >
                {/* Highlight Glow Overlay */}
                {data.highlight && (
                    <div className="absolute inset-0 bg-violet-500/5 pointer-events-none z-0" />
                )}

                {/* Thumbnail */}
                <div
                    className={cn(
                        "relative z-10 h-10 w-10 shrink-0 flex items-center justify-center border pointer-events-none",
                        data.thumbnail && "text-slate-300"
                    )}
                    style={{
                        backgroundColor: isRetro ? currentTheme.colors.background : '#f1f5f9', // slate-100 or theme bg
                        borderRadius: isRetro ? '0px' : '0.5rem', // rounded-lg
                        borderColor: currentTheme.colors.border,
                        borderWidth: isRetro ? '1px' : '0px', // borders for retro
                    }}
                >
                    {renderThumbnail(data.thumbnail, data.thumbnail ? "h-5 w-5" : "h-4 w-4")}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col min-w-0 flex-1 pointer-events-none">
                    <span className="font-medium truncate leading-snug" ref={containerRef}>
                        {data.title || <span className="text-slate-400 italic">Empty Link</span>}
                    </span>
                    {data.url && (
                        <span className="text-[11px] truncate opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: currentTheme.colors.text, opacity: 0.6 }}>
                            {data.url.replace(/^https?:\/\//, '')}
                        </span>
                    )}
                </div>
                {!data.isActive && (
                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-slate-100/80 backdrop-blur-sm border-slate-200 shadow-sm text-slate-500">Hidden</Badge>
                    </div>
                )}
            </div>
        )
    }

    return renderContent()
}
