"use client"

import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface HeaderBlockProps {
    id: string
    data: {
        title: string // Name
        description?: string // Bio
        thumbnail?: string // Profile Pic
        isActive: boolean
    }
}

export function HeaderBlock({ id, data }: HeaderBlockProps) {
    const { currentTheme } = useBuilderStore()

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center text-center p-4"
            style={{
                fontFamily: currentTheme.styles.fontFamily,
                color: 'var(--theme-block-text)',
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
            }}
        >
            {/* Avatar */}
            <div
                className="mb-4 relative shrink-0 overflow-hidden"
                style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%', // Always circular for profile
                    backgroundColor: currentTheme.colors.card,
                    border: `${currentTheme.styles.borderWidth} solid ${currentTheme.colors.border}`,
                    boxShadow: currentTheme.styles.shadow
                }}
            >
                {data.thumbnail ? (
                    <img
                        src={data.thumbnail}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <User className="h-10 w-10" />
                    </div>
                )}
            </div>

            {/* Name */}
            <h1 className="text-xl font-bold tracking-tight mb-2">
                {data.title || "Your Name"}
            </h1>

            {/* Bio */}
            {data.description && (
                <p className="text-sm opacity-80 max-w-[80%] mx-auto leading-relaxed">
                    {data.description}
                </p>
            )}

            {!data.isActive && (
                <div className="absolute top-2 right-2">
                    <span className="bg-slate-900/10 text-slate-900 text-[10px] px-1.5 py-0.5 rounded-full font-medium">Hidden</span>
                </div>
            )}
        </div>
    )
}
