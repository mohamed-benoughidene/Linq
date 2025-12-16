"use client"

import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"

interface VideoBlockProps {
    id: string
    data: {
        embedUrl?: string
        isActive: boolean
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
                className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-lg"
                style={{ borderRadius: currentTheme.styles.borderRadius }}
            >
                Enter a YouTube or Vimeo URL
            </div>
        )
    }

    return (
        <div
            className="w-full h-full overflow-hidden bg-black relative rounded-lg border border-transparent"
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
            {!data.isActive && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded">Hidden</span>
                </div>
            )}
        </div>
    )
}
