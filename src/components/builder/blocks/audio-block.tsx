"use client"

import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"

interface AudioBlockProps {
    id: string
    data: {
        embedUrl?: string
        isActive: boolean
        highlight?: boolean
    }
}

export function AudioBlock({ id, data }: AudioBlockProps) {
    const { currentTheme } = useBuilderStore()

    // Very basic Spotify/SoundCloud embed logic
    const getEmbedSrc = (url?: string) => {
        if (!url) return null

        if (url.includes('spotify.com')) {
            // Convert https://open.spotify.com/track/ID to https://open.spotify.com/embed/track/ID
            // If it's already an embed link, great, otherwise inject /embed
            if (url.includes('/embed/')) return url
            return url.replace('spotify.com/', 'spotify.com/embed/')
        }

        if (url.includes('soundcloud.com')) {
            return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`
        }

        return null
    }

    const embedSrc = getEmbedSrc(data.embedUrl)

    if (!embedSrc) {
        return (
            <div
                className="w-full h-full flex items-center justify-center text-sm font-medium border-2 border-dashed"
                style={{
                    borderRadius: currentTheme.styles.borderRadius,
                    borderColor: currentTheme.colors.border,
                    background: 'var(--theme-block-bg)',
                    color: 'var(--theme-block-text)',
                    opacity: 0.5
                }}
            >
                Enter a Spotify or SoundCloud URL
            </div>
        )
    }

    return (
        <div
            className={cn(
                "w-full h-full overflow-hidden relative rounded-lg border border-transparent outline-none",
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={{
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border,
                background: 'var(--theme-block-bg)'
            }}
        >
            <iframe
                src={embedSrc}
                className="w-full h-full absolute inset-0"
                allow="encrypted-media"
                loading="lazy"
            />
            {/* Hidden Badge */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}
        </div>
    )
}
