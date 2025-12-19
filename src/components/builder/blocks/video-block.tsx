"use client"

import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"

interface VideoBlockProps {
    id: string
    data: {
        embedUrl?: string
        isActive: boolean
        highlight?: boolean
    }
}

export function VideoBlock({ id, data }: VideoBlockProps) {
    const { currentTheme } = useBuilderStore()

    // Simple regex to extract ID (very basic, can be improved)
    // Supports: youtube.com/watch?v=, youtu.be/, vimeo.com/
    const getEmbedSrc = (url?: string) => {
        if (!url) return null

        let videoId = ''
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
            const match = url.match(regExp)
            videoId = (match && match[2].length === 11) ? match[2] : ''
            if (videoId) return `https://www.youtube.com/embed/${videoId}`
        } else if (url.includes('vimeo.com')) {
            const regExp = /vimeo.com\/(\d+)/
            const match = url.match(regExp)
            videoId = match ? match[1] : ''
            if (videoId) return `https://player.vimeo.com/video/${videoId}`
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
                Enter a YouTube or Vimeo URL
            </div>
        )
    }

    return (
        <div
            className={cn(
                "w-full h-full overflow-hidden bg-black relative rounded-lg border border-transparent outline-none",
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={{
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border,
            }}
        >
            <iframe
                src={embedSrc}
                className="w-full h-full absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
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
