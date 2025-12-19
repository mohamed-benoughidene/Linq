"use client"

import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"
import { GalleryAccordion } from "./gallery/gallery-accordion"
import { GalleryCoverflow } from "./gallery/gallery-coverflow"
import { GalleryCreative } from "./gallery/gallery-creative"
import { GalleryStack } from "./gallery/gallery-stack"

interface GalleryBlockProps {
    id: string
    data: {
        galleryType?: 'carousel' | 'accordion' | 'creative' | 'stack'
        images?: { id: string; url: string; alt?: string }[]
        isActive: boolean
        highlight?: boolean
    }
}

export function GalleryBlock({ id, data }: GalleryBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { galleryType = 'carousel', images = [] } = data

    // Empty State
    if (!images || images.length === 0) {
        return (
            <div
                className="w-full h-full min-h-[120px] flex flex-col items-center justify-center text-sm font-medium border-2 border-dashed p-4 gap-2"
                style={{
                    background: 'var(--theme-block-bg)',
                    borderRadius: 'var(--theme-radius)',
                    borderColor: currentTheme.colors.border,
                    color: 'var(--theme-block-text)',
                    opacity: 0.5
                }}
            >
                <ImageIcon className="h-6 w-6 opacity-50" />
                <span>Add Images</span>
            </div>
        )
    }

    const renderContent = () => {
        const borderRadius = currentTheme.styles.borderRadius;
        switch (galleryType) {
            case 'accordion':
                return <GalleryAccordion images={images} borderRadius={borderRadius} />
            case 'creative':
                return <GalleryCreative images={images} borderRadius={borderRadius} />
            case 'stack':
                return <GalleryStack images={images} borderRadius={borderRadius} />
            case 'carousel':
                // "3D Carousel" / Coverflow
                return <GalleryCoverflow images={images} borderRadius={borderRadius} />
            default:
                // Fallback to carousel
                return <GalleryCoverflow images={images} borderRadius={borderRadius} />
        }
    }

    return (
        <div
            className={cn(
                "w-full h-full overflow-hidden relative border border-transparent outline-none",
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: currentTheme.styles.borderRadius,
                borderColor: currentTheme.colors.border
            }}
        >
            {renderContent()}

            {/* Hidden Badge */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}
        </div>
    )
}
