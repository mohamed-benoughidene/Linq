"use client"

import { useState, useRef } from "react"
import {
    Trash2,
    Image as ImageIcon,
    Star,
    LayoutList,
    Grid2x2,
    Square,
    RectangleHorizontal,
    Maximize,
    Globe,
    Instagram,
    Twitter,
    Github,
    Linkedin,
    Youtube,
    Facebook,
    Mail,
    Phone,
    Music,
    Video,

    Link as LinkIcon,
    Link2,
    User,
    GripVertical,
    Pencil
} from "lucide-react"
import { useBuilderStore } from "@/store/builder-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface LinkBlockProps {
    id: string
    data: {
        title: string
        url: string
        isActive: boolean
        thumbnail?: string
        variant?: 'icon' | 'square' | 'classic' | 'wide' | 'hero'
        highlight?: boolean
        items?: { id: string; title: string; url: string; icon?: string }[]
    }
    layout?: { i: string; x: number; y: number; w: number; h: number }
}

const VARIANTS = {
    // Note: Grid Layout handles the sizing now via 'layout' prop, 
    // but we can still use these for internal styling if needed.
    // However, the container size is determined by the grid item.
    // For now, these classes might just ensure full width/height.
    icon: "h-full w-full",
    square: "h-full w-full",
    classic: "h-full w-full",
    wide: "h-full w-full",
    hero: "h-full w-full",
}

const ICON_MAP: Record<string, React.FC<any>> = {
    "Globe": Globe,
    "Instagram": Instagram,
    "Twitter": Twitter,
    "Github": Github,
    "Linkedin": Linkedin,
    "Youtube": Youtube,
    "Facebook": Facebook,
    "Mail": Mail,
    "Phone": Phone,
    "Music": Music,
    "Video": Video,
    "Image": ImageIcon,
    "Link": LinkIcon,
    "User": User
}

export function LinkBlock({ id, data, layout }: LinkBlockProps) {
    const { updateBlock, removeBlock, updateLayout, currentTheme } = useBuilderStore()
    const containerRef = useRef<HTMLDivElement>(null)

    const variant = data.variant || 'classic'

    // Helper to render thumbnail (Icon or Emoji fallback)
    const renderThumbnail = (iconName?: string, className?: string) => {
        if (!iconName) {
            const isLarge = variant === 'square' || variant === 'hero'
            const sizeClass = isLarge ? "h-10 w-10" : "h-6 w-6"
            return <Link2 className={cn("text-slate-300", sizeClass)} strokeWidth={1.5} />
        }

        const IconComponent = ICON_MAP[iconName]
        if (IconComponent) {
            return <IconComponent className={className || "h-4 w-4"} />
        }

        // Fallback for emojis
        return <span className={cn("text-lg leading-none", className)}>{iconName}</span>
    }

    // Determine if we should show simple inputs or complex content
    const isSimpleLayout = variant === 'classic' || variant === 'icon'

    // Helper to update layout (w/h) based on variant selection
    const handleVariantChange = (newVariant: LinkBlockProps['data']['variant']) => {
        // 1. Update visual content style
        updateBlock(id, { variant: newVariant })

        // 2. Update Grid Dimensions
        if (!layout) return

        let w = layout.w
        let h = layout.h

        switch (newVariant) {
            case 'icon': w = 1; h = 2; break;     // 1x2 (~136px height)
            case 'square': w = 2; h = 4; break;   // 2x4 (~288px height)
            case 'classic': w = 6; h = 1; break;  // 6x1 (~60px height - Thin Bar)
            case 'wide': w = 4; h = 2; break;     // 4x2 (~136px height)
            case 'hero': w = 6; h = 5; break;     // 6x5 (~364px height)
        }

        // Only update if changed prevents verify loop potentially, but nice to enforce
        updateLayout([{ ...layout, w, h }])
    }



    // --- Editor Content (Popover) ---
    const editorContent = (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm font-semibold text-slate-900">Edit Block</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBlock(id)}
                    className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    title="Delete Block"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Layout Selector */}
            <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Layout</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    {[
                        { id: 'icon', icon: Grid2x2, label: 'Icon' },
                        { id: 'square', icon: Square, label: 'Box' },
                        { id: 'classic', icon: LayoutList, label: 'Bar' },
                        { id: 'wide', icon: RectangleHorizontal, label: 'Banner' },
                        { id: 'hero', icon: Maximize, label: 'Hero' },
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleVariantChange(option.id as any)}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all",
                                variant === option.id ? "bg-white shadow-sm text-slate-900 ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700"
                            )}
                            title={option.label}
                        >
                            <option.icon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Conditional Inputs */}
            {!isSimpleLayout ? (
                <div className="flex-1 space-y-3 min-w-0">
                    {/* Thumbnail Picker (For the Bento Card itself) */}
                    <div className="flex gap-2">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 w-9 shrink-0 p-0 overflow-hidden rounded-lg shadow-sm bg-slate-50 border-slate-200"
                                    title="Background Icon"
                                >
                                    {renderThumbnail(data.thumbnail, "h-4 w-4")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[196px] z-[200]">
                                <div className="grid grid-cols-4 gap-2 p-2">
                                    {Object.entries(ICON_MAP).map(([name, Icon]) => (
                                        <DropdownMenuItem
                                            key={name}
                                            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer p-0"
                                            onSelect={() => updateBlock(id, { thumbnail: name })}
                                            title={name}
                                        >
                                            <Icon className="h-5 w-5 text-slate-700" />
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        className="col-span-4 flex h-8 items-center justify-center rounded-md hover:bg-red-50 text-xs text-red-500 font-medium mt-2 border border-red-100 cursor-pointer p-0"
                                        onSelect={() => updateBlock(id, { thumbnail: undefined })}
                                    >
                                        Remove
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Input
                            placeholder="Card Title"
                            value={data.title}
                            onChange={(e) => updateBlock(id, { title: e.target.value })}
                            className="h-9 font-medium"
                        />
                    </div>
                    <Input
                        placeholder="Link URL"
                        value={data.url}
                        onChange={(e) => updateBlock(id, { url: e.target.value })}
                        className="h-8 text-xs text-slate-500"
                    />
                </div>
            ) : (
                <>
                    {/* Standard Inputs (Classic/Icon) */}
                    <div className="flex gap-3">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 w-10 shrink-0 p-0 overflow-hidden rounded-lg shadow-sm bg-slate-50 border-slate-200"
                                    title="Select Icon"
                                >
                                    {renderThumbnail(data.thumbnail, "h-5 w-5")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[196px] z-[200]">
                                <div className="grid grid-cols-4 gap-2 p-2">
                                    {Object.entries(ICON_MAP).map(([name, Icon]) => (
                                        <DropdownMenuItem
                                            key={name}
                                            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 cursor-pointer p-0"
                                            onSelect={() => updateBlock(id, { thumbnail: name })}
                                            title={name}
                                        >
                                            <Icon className="h-5 w-5 text-slate-700" />
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        className="col-span-4 flex h-8 items-center justify-center rounded-md hover:bg-red-50 text-xs text-red-500 font-medium mt-2 border border-red-100 cursor-pointer p-0"
                                        onSelect={() => updateBlock(id, { thumbnail: undefined })}
                                    >
                                        Remove Button
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex-1 space-y-2 min-w-0">
                            <Input
                                placeholder="Link Title"
                                value={data.title}
                                onChange={(e) => updateBlock(id, { title: e.target.value })}
                                className="h-9 font-medium"
                            />
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://example.com"
                                    value={data.url}
                                    onChange={(e) => updateBlock(id, { url: e.target.value })}
                                    className="h-8 text-xs text-slate-500"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateBlock(id, { highlight: !data.highlight })}
                                    className={cn(
                                        "h-8 w-8 shrink-0 rounded-md transition-colors",
                                        data.highlight ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                    )}
                                    title="Highlight"
                                >
                                    <Star className={cn("h-4 w-4", data.highlight && "fill-current")} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Footer Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-2">
                    <Switch
                        id={`block-active-${id}`}
                        checked={data.isActive}
                        onCheckedChange={(checked) => updateBlock(id, { isActive: checked })}
                        className="scale-75 origin-left"
                    />
                    <Label htmlFor={`block-active-${id}`} className="text-xs text-slate-500 font-medium">
                        {data.isActive ? 'Visible' : 'Hidden'}
                    </Label>
                </div>
            </div>
        </div>
    )

    // --- Content Rendering ---
    const renderContent = () => {
        // Base Dynamic Styles
        const baseStyles: React.CSSProperties = {
            backgroundColor: currentTheme.colors.card,
            color: currentTheme.colors.text,
            borderColor: currentTheme.colors.border,
            borderWidth: currentTheme.styles.borderWidth,
            borderRadius: currentTheme.styles.borderRadius,
            boxShadow: currentTheme.styles.shadow,
            fontFamily: currentTheme.styles.fontFamily,
        }

        const isRetro = currentTheme.type === 'retro'
        const retroHoverClass = isRetro ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75" : "hover:scale-[1.01] hover:shadow-md transition-all duration-200"

        if (variant === 'icon') {
            return (
                <div
                    className={cn(
                        "w-full h-full flex items-center justify-center border outline-none",
                        retroHoverClass,
                        !isRetro && "group-hover:border-slate-400 group-hover:shadow-md", // Only modern needs border hover color change usually
                        data.highlight && "ring-2 ring-violet-500 ring-offset-2",
                        data.highlight && "animate-pulse"
                    )}
                    style={baseStyles}
                >
                    {renderThumbnail(data.thumbnail, "h-6 w-6")}

                    {!data.isActive && (
                        <div className="absolute -top-1 -right-1 z-20 pointer-events-none">
                            <Badge variant="secondary" className="text-[8px] px-1 h-3.5 bg-slate-100 border-slate-200">Hidden</Badge>
                        </div>
                    )}
                </div>
            )
        }

        if (!isSimpleLayout) {
            // Square/Wide/Hero Variants
            return (
                <div
                    className={cn(
                        "w-full h-full relative overflow-hidden border flex flex-col justify-end p-4 outline-none",
                        retroHoverClass,
                        !isRetro && "group-hover:border-slate-400 group-hover:shadow-md",
                        data.highlight && "ring-2 ring-violet-500 ring-offset-2",
                        data.highlight && "animate-pulse"
                    )}
                    style={baseStyles}
                >
                    {/* Background */}
                    <div className="absolute inset-0 z-0">
                        {data.thumbnail && ICON_MAP[data.thumbnail] ? (
                            <>
                                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center opacity-10">
                                    {renderThumbnail(data.thumbnail, "h-full w-full p-8")}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full pointer-events-none">
                        <div className="mb-2 filter drop-shadow-sm select-none">
                            {renderThumbnail(data.thumbnail, "h-6 w-6")}
                        </div>
                        <span className="block text-sm font-semibold tracking-tight leading-tight truncate w-full">
                            {data.title || <span className="text-slate-400 italic font-normal">Empty Link</span>}
                        </span>
                    </div>

                    {!data.isActive && (
                        <div className="absolute top-2 left-2 z-20 pointer-events-none">
                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-slate-100/80 backdrop-blur-sm border-slate-200 shadow-sm text-slate-500">Hidden</Badge>
                        </div>
                    )}
                </div>
            )
        }

        // Classic (Bar) Variant
        return (
            <div
                className={cn(
                    "w-full h-full p-4 border flex items-center gap-4 outline-none",
                    retroHoverClass,
                    !isRetro && "group-hover:border-slate-400 group-hover:shadow-md",
                    data.highlight && "ring-2 ring-violet-500 ring-offset-2",
                    data.highlight && "animate-pulse"
                )}
                style={baseStyles}
            >
                {/* Highlight Glow Overlay */}
                {data.highlight && (
                    <div className="absolute inset-0 bg-violet-500/5 pointer-events-none z-0" />
                )}

                {/* Thumbnail */}
                <div
                    className={cn(
                        "relative z-10 h-10 w-10 shrink-0 flex items-center justify-center border pointer-events-none",
                        data.thumbnail && "text-slate-300"
                    )}
                    style={{
                        backgroundColor: isRetro ? currentTheme.colors.background : '#f1f5f9', // slate-100 or theme bg
                        borderRadius: isRetro ? '0px' : '0.5rem', // rounded-lg
                        borderColor: currentTheme.colors.border,
                        borderWidth: isRetro ? '1px' : '0px', // borders for retro
                    }}
                >
                    {renderThumbnail(data.thumbnail, data.thumbnail ? "h-5 w-5" : "h-4 w-4")}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col min-w-0 flex-1 pointer-events-none">
                    <span className="font-medium truncate leading-snug" ref={containerRef}>
                        {data.title || <span className="text-slate-400 italic">Empty Link</span>}
                    </span>
                    {data.url && (
                        <span className="text-[11px] truncate opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: currentTheme.colors.text, opacity: 0.6 }}>
                            {data.url.replace(/^https?:\/\//, '')}
                        </span>
                    )}
                </div>
                {!data.isActive && (
                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-slate-100/80 backdrop-blur-sm border-slate-200 shadow-sm text-slate-500">Hidden</Badge>
                    </div>
                )}
            </div>
        )
    }

    // --- Main Render with Separate Drag vs. Edit ---
    return (
        <div
            className={cn(
                "relative group w-full h-full cursor-grab active:cursor-grabbing",
                !data.isActive && "opacity-60 grayscale"
            )}
            data-id={`builder-block-${id}-container`}
        >
            {/* The Visual Content (Acts as Drag Grip) */}
            {renderContent()}

            {/* The Editor Overlay */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "absolute top-2 right-2 z-50 h-8 w-8 rounded-full shadow-sm bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white",
                            "opacity-0 group-hover:opacity-100 group-active:opacity-0 active:!opacity-100 transition-opacity"
                        )}
                        onMouseDown={(e) => {
                            e.stopPropagation(); // Stop drag start
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // Stop click propagation
                        }}
                        title="Edit Block"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    side="left"
                    align="start"
                    sideOffset={10}
                    collisionPadding={20}
                    avoidCollisions={true}
                    className="w-80 z-[100] p-4"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        // Optional: Prevent closing if interacting with specific things, but default is fine
                    }}
                    onPointerDownOutside={(e) => {
                        // Prevent drag start on grid when clicking outside popover? 
                        // No, default behavior is fine.
                    }}
                >
                    {editorContent}
                </PopoverContent>
            </Popover>
        </div>
    )
}
