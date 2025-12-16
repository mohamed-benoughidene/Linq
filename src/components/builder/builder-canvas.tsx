"use client"

import { useMemo, useCallback } from "react"
import { Responsive, WidthProvider, Layout } from "react-grid-layout"
import debounce from "lodash.debounce"
import { useBuilderStore } from "@/store/builder-store"
import { BlockRenderer } from "./block-renderer"
import { Button } from "@/components/ui/button"
import {
    Plus,
    Link as LinkIcon,
    Video,
    Music,
    User,
    Image as ImageIcon,
    Mail
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ResponsiveGridLayout = WidthProvider(Responsive)

export function BuilderCanvas() {
    const { blocks, addBlock, updateLayout, currentTheme } = useBuilderStore()

    const debouncedUpdateLayout = useMemo(
        () => debounce((currentLayout: Layout[]) => {
            updateLayout(currentLayout)
        }, 200),
        [updateLayout]
    )

    const onLayoutChange = useCallback((layout: Layout[]) => {
        debouncedUpdateLayout(layout)
    }, [debouncedUpdateLayout])

    const renderAddButton = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="mt-4 gap-2" data-id="builder-empty-add-btn">
                    <Plus className="h-4 w-4" /> Add Block
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem onClick={() => addBlock('link')}>
                    <LinkIcon className="mr-2 h-4 w-4" /> Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock('header')}>
                    <User className="mr-2 h-4 w-4" /> Header / Bio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock('video')}>
                    <Video className="mr-2 h-4 w-4" /> Video (YouTube)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock('audio')}>
                    <Music className="mr-2 h-4 w-4" /> Audio (Spotify)
                </DropdownMenuItem>
                {/* 
                <DropdownMenuItem onClick={() => addBlock('image')}>
                    <ImageIcon className="mr-2 h-4 w-4" /> Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock('newsletter')}>
                    <Mail className="mr-2 h-4 w-4" /> Newsletter
                </DropdownMenuItem>
                */}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const gridStyles = `
      .react-grid-placeholder {
        background: ${currentTheme.colors.primary} !important;
        opacity: 0.15 !important;
        border-radius: ${currentTheme.styles.borderRadius} !important;
        border: ${currentTheme.styles.borderWidth} solid ${currentTheme.colors.border} !important;
        z-index: 10 !important;
      }
    `

    return (
        <div
            className="h-full w-full p-4 transition-colors duration-300 ease-in-out flex flex-col"
            data-id="builder-canvas-list"
            style={{
                background: currentTheme.colors.background,
                fontFamily: currentTheme.styles.fontFamily,
                '--theme-block-bg': currentTheme.styles.blockBackgroundColor || '#ffffff',
                '--theme-block-align': currentTheme.styles.blockAlign || 'left',
                '--theme-radius': currentTheme.styles.borderRadius,
                '--theme-block-alpha': currentTheme.styles.blockTransparency || 0,
                '--theme-block-text': currentTheme.styles.blockTextColor || currentTheme.colors.text,
                '--theme-block-btn-bg': currentTheme.styles.blockButtonBg || currentTheme.colors.primary,
                '--theme-block-btn-text': currentTheme.styles.blockButtonText || '#ffffff',
                '--theme-block-label': currentTheme.styles.blockLabelColor || '#64748b',
            } as React.CSSProperties}
        >
            <style>{gridStyles}</style>

            {blocks.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-slate-200/50 bg-white/50 p-8 text-center animate-in fade-in-50 backdrop-blur-sm" data-id="builder-canvas-empty">
                    <div className="rounded-full bg-slate-100 p-3">
                        <Plus className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="max-w-[420px] space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Start Building
                        </h3>
                        <p className="text-sm text-slate-500">
                            Add links, videos, music, or a profile header to your page.
                        </p>
                        {renderAddButton()}
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={{ lg: blocks.map(b => b.layout) }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 6, md: 6, sm: 4, xs: 2, xxs: 2 }}
                        rowHeight={60}
                        margin={[16, 16]}
                        compactType="vertical"
                        isResizable={false}
                        isDraggable={true}
                        onLayoutChange={onLayoutChange}
                        useCSSTransforms={true}
                        draggableHandle=".drag-handle"
                    >
                        {blocks.map((block) => (
                            <div key={block.id} data-grid={block.layout}>
                                <BlockRenderer block={block} />
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                </div>
            )}
        </div>
    )
}
