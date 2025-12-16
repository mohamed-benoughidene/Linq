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
            className="w-full h-full relative overflow-hidden shadow-sm group border"
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border
            }}
        >
            {/* Visual Drag Handle - Higher z-index to be clickable over iframe if needed, 
                though usually the parent handles dragging. 
                We add a 'click shield' for the builder dragging over the iframe?
                Actually, usually drag-handle is outside the iframe or we use a 'pointer-events-none' overlay while dragging.
                But simplifying: Just a handle at top.
            */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-sm p-1 rounded-full text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="h-4 w-4" />
            </div>

            {/* Shield for Dragging (prevent iframe theft of mouse events) */}
            <div className="absolute inset-0 z-10 pointer-events-none group-hover:pointer-events-auto group-hover:bg-transparent" />
            {/* Wait, if pointer-events-auto on hover, we can't interact with map? 
                Builder requirement: Dragging map is prioritized. 
                Usually we want an "Edit" button to unlock map interaction or just treat it as static image in builder.
                For now, let's keep it simple: Map is largely static in builder visualization.
            */}

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

            <div className="absolute bottom-2 left-2 z-20 bg-white/90 px-2 py-1 rounded text-[10px] font-medium text-slate-600 flex items-center gap-1 shadow-sm">
                <MapPin className="h-3 w-3" />
                {address}
            </div>
        </div>
    )
}
