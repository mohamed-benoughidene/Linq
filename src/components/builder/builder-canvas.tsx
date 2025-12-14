"use client"

import { useMemo, useCallback } from "react"
import { Responsive, WidthProvider, Layout } from "react-grid-layout"
import debounce from "lodash.debounce"
import { useBuilderStore } from "@/store/builder-store"
import { LinkBlock } from "./link-block"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ResponsiveGridLayout = WidthProvider(Responsive)

// Custom styles for the grid placeholder
const gridStyles = `
  .react-grid-placeholder {
    background: #8b5cf6 !important; /* violet-500 */
    opacity: 0.2 !important;
    border-radius: 0.75rem !important; /* rounded-xl */
    z-index: 10 !important;
  }
`

export function BuilderCanvas() {
    const { blocks, addBlock, updateLayout, currentTheme } = useBuilderStore()

    // Create a debounced update function to avoid spamming the store on every pixel drag
    const debouncedUpdateLayout = useMemo(
        () => debounce((currentLayout: Layout[]) => {
            updateLayout(currentLayout)
        }, 200),
        [updateLayout]
    )

    const onLayoutChange = useCallback((layout: Layout[]) => {
        debouncedUpdateLayout(layout)
    }, [debouncedUpdateLayout])

    if (blocks.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center animate-in fade-in-50" data-id="builder-canvas-empty">
                <div className="rounded-full bg-slate-100 p-3">
                    <Plus className="h-6 w-6 text-slate-400" />
                </div>
                <div className="max-w-[420px] space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Add your first link
                    </h3>
                    <p className="text-sm text-slate-500">
                        Start building your page by adding a link block. You can customize the title and URL.
                    </p>
                    <Button onClick={() => addBlock('link')} className="mt-4" data-id="builder-empty-add-btn">
                        Add Link
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div
            className="h-full w-full p-4 transition-colors duration-300 ease-in-out"
            data-id="builder-canvas-list"
            style={{
                backgroundColor: currentTheme.colors.background,
                fontFamily: currentTheme.styles.fontFamily
            }}
        >
            <style>{gridStyles}</style>
            {/* 
                We use a key on ResponsiveGridLayout to force a re-render if the number of blocks changes radically? 
                Actually RGL handles children additions fine.
             */}
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: blocks.map(b => b.layout) }} // We only maintain one main layout for now 'lg'
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 6, md: 6, sm: 4, xs: 2, xxs: 2 }}
                rowHeight={60}
                margin={[16, 16]}
                compactType="vertical"
                isResizable={false}
                isDraggable={true}
                onLayoutChange={onLayoutChange}
                // Animation settings
                useCSSTransforms={true}
            >
                {blocks.map((block) => (
                    <div key={block.id} data-grid={block.layout}>
                        <LinkBlock id={block.id} data={block.content} layout={block.layout} />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    )
}
