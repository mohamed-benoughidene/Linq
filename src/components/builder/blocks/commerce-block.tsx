import { BuilderBlock, useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { GripHorizontal } from "lucide-react"

interface CommerceBlockProps {
    id: string
    data: BuilderBlock['content']
}

export function CommerceBlock({ data }: CommerceBlockProps) {
    const { currentTheme } = useBuilderStore()
    const {
        title = "Digital Guide",
        price = "10.00",
        currency = "$",
        description = "",
        image,
        buttonText = "Buy Now",
        variant = "hero" // Default to hero/card style
    } = data

    // Base Dynamic Styles
    const baseStyles: React.CSSProperties = {
        background: 'var(--theme-block-bg)',
        color: 'var(--theme-block-text)',
        borderColor: currentTheme.colors.border,
        borderWidth: currentTheme.styles.borderWidth,
        borderRadius: 'var(--theme-radius)',
        boxShadow: currentTheme.styles.shadow,
        fontFamily: currentTheme.styles.fontFamily,
    }

    const isRetro = currentTheme.type === 'retro'
    const retroHoverClass = isRetro ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75" : "hover:shadow-md transition-all duration-200"

    return (
        <div
            className={cn(
                "w-full h-full overflow-hidden flex flex-col group relative transition-all duration-200 border outline-none",
                retroHoverClass,
                !isRetro && "hover:border-slate-400/50",
                // @ts-ignore
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={baseStyles}
        >
            {/* Visual Drag Handle */}
            <div
                className="absolute top-2 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ color: 'var(--theme-block-text)', opacity: 0.5 }}
            >
                <GripHorizontal className="h-4 w-4 drop-shadow-sm" />
            </div>

            {/* Hidden Badge */}
            {/* @ts-ignore */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}
            {/* Image Section */}
            {image && (
                <div className={cn(
                    "w-full overflow-hidden bg-slate-100 flex-shrink-0",
                    variant === 'square' ? "aspect-square" : "h-40"
                )}
                    style={{
                        borderBottomWidth: currentTheme.styles.borderWidth,
                        borderBottomColor: currentTheme.colors.border
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {!image && (
                <div
                    className="w-full h-32 bg-slate-50/50 flex items-center justify-center text-slate-300 flex-shrink-0"
                    style={{
                        borderBottomWidth: currentTheme.styles.borderWidth,
                        borderBottomColor: currentTheme.colors.border
                    }}
                >
                    <span className="text-xs">No Image</span>
                </div>
            )}

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col gap-2 min-h-0">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm line-clamp-2 leading-tight" style={{ fontFamily: currentTheme.styles.fontFamily }}>
                        {title}
                    </h3>
                    <span
                        className={cn("shrink-0 font-medium px-2 py-0.5 rounded text-xs")}
                        style={{
                            color: currentTheme.colors.primary,
                            backgroundColor: isRetro ? 'transparent' : `${currentTheme.colors.primary}15`, // 10% opacity
                            border: isRetro ? `1px solid ${currentTheme.colors.primary}` : 'none'
                        }}
                    >
                        {currency}{price}
                    </span>
                </div>

                {description && (
                    <p className="text-xs opacity-80 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}

                <div className="mt-auto pt-2">
                    <button
                        className={cn(
                            "w-full py-2 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-95"
                        )}
                        style={{
                            backgroundColor: currentTheme.styles.blockButtonBg || currentTheme.colors.primary,
                            color: currentTheme.styles.blockButtonText || '#ffffff',
                            borderRadius: 'var(--theme-radius)',
                            fontFamily: currentTheme.styles.fontFamily
                        }}
                    >
                        {buttonText} — {currency}{price}
                    </button>
                </div>
            </div>
        </div>
    )
}
