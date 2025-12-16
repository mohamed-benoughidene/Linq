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
    }
}

export function GalleryBlock({ id, data }: GalleryBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { galleryType = 'carousel', images = [] } = data

    // Empty State
    if (!images || images.length === 0) {
        return (
            <div
                className="w-full h-full min-h-[120px] flex flex-col items-center justify-center text-slate-400 text-sm font-medium border-2 border-dashed p-4 gap-2"
                style={{
                    background: 'var(--theme-block-bg)',
                    borderRadius: 'var(--theme-radius)',
                    borderColor: currentTheme.colors.border
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
            className="w-full h-full overflow-hidden relative border border-transparent"
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: currentTheme.styles.borderRadius,
                borderColor: currentTheme.colors.border
            }}
        >
            {renderContent()}
        </div>
    )
}
