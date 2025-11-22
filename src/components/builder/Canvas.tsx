'use client'

import { useBuilderStore } from '@/store/builderStore'
import { BlockRenderer } from './BlockRenderer'
import { BlockEditor } from './BlockEditor'
import { useEffect } from 'react'

export function Canvas() {
    const { blocks, selectedBlockId, selectBlock, undo, redo } = useBuilderStore()

    useEffect(() => {
        // Expose store to window for debugging/testing
        if (typeof window !== 'undefined') {
            (window as any).useBuilderStore = useBuilderStore
        }
    }, [])

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input or textarea
            if (
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                (document.activeElement as HTMLElement).isContentEditable
            ) {
                return
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    e.preventDefault()
                    redo()
                } else {
                    e.preventDefault()
                    undo()
                }
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                e.preventDefault()
                redo()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [undo, redo])

    return (
        <div className="canvas min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-4">
                {blocks.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                        No blocks yet. Add one from the sidebar!
                    </p>
                ) : (
                    blocks.map((block) => (
                        <BlockEditor
                            key={block.id}
                            block={block}
                            open={selectedBlockId === block.id}
                            onOpenChange={(open) => selectBlock(open ? block.id : null)}
                        >
                            <div>
                                <BlockRenderer block={block} />
                            </div>
                        </BlockEditor>
                    ))
                )}
            </div>
        </div>
    )
}
