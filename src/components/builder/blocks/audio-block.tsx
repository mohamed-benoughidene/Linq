"use client"

import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"

interface AudioBlockProps {
    id: string
    data: {
        embedUrl?: string
        isActive: boolean
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
                className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-lg"
                style={{ borderRadius: currentTheme.styles.borderRadius }}
            >
                Enter a Spotify or SoundCloud URL
            </div>
        )
    }

    return (
        <div
            className="w-full h-full overflow-hidden bg-slate-50 relative rounded-lg border border-transparent"
            style={{
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border,
            }}
        >
            <iframe
                src={embedSrc}
                className="w-full h-full absolute inset-0"
                allow="encrypted-media"
                loading="lazy"
            />
            {!data.isActive && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded">Hidden</span>
                </div>
            )}
        </div>
    )
}
