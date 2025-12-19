"use client"

import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { GripHorizontal, MapPin } from "lucide-react"

interface MapBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function MapBlock({ id, data }: MapBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { address = "New York, NY" } = data

    // Using OSM embed as a free fallback since we don't have a Google Maps API Key variables available comfortably
    // A robust robust impl would use a real key. 
    // Format for OSM: https://www.openstreetmap.org/export/embed.html?bbox=...
    // Actually, simple Google Maps Embed API is often better even without key for basic places, or it errors.
    // Let's use a "Maps Embed" URL format that might work freely or show a placeholder if invalid key. 
    // Alternatively, `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed` is a common trick.
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`

    return (
        <div
            className={cn(
                "w-full h-full relative overflow-hidden shadow-sm group border outline-none",
                // @ts-ignore
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border
            }}
        >
            {/* Hidden Badge */}
            {/* @ts-ignore */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}
            {/* Visual Drag Handle - Higher z-index to be clickable over iframe if needed, 
                though usually the parent handles dragging. 
                We add a 'click shield' for the builder dragging over the iframe?
                Actually, usually drag-handle is outside the iframe or we use a 'pointer-events-none' overlay while dragging.
                But simplifying: Just a handle at top.
            */}
            {/* Visual Drag Handle */}
            <div
                className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border"
                style={{
                    color: 'var(--theme-block-text)',
                    borderColor: currentTheme.colors.border,
                    backgroundColor: currentTheme.colors.background === '#ffffff' ? 'rgba(255,255,255,0.9)' : currentTheme.colors.background
                }}
            >
                <GripHorizontal className="h-4 w-4" />
            </div>

            {/* Shield for Dragging (prevent iframe theft of mouse events) */}
            <div className="absolute inset-0 z-10 pointer-events-none group-hover:pointer-events-auto group-hover:bg-transparent" />

            <iframe
                width="100%"
                height="100%"
                src={mapSrc}
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                className="w-full h-full filter grayscale-[0.2]"
                style={{ pointerEvents: 'none' }} // Disable interaction in builder to allow dragging
            />

            <div
                className="absolute bottom-2 left-2 z-20 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm border"
                style={{
                    backgroundColor: currentTheme.colors.background === '#ffffff' ? 'rgba(255,255,255,0.9)' : currentTheme.colors.background,
                    color: 'var(--theme-block-text)',
                    borderColor: currentTheme.colors.border
                }}
            >
                <MapPin className="h-3 w-3" />
                {address}
            </div>
        </div>
    )
}
