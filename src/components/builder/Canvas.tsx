'use client'

import { useBuilderStore } from '@/store/builderStore'
import { BlockRenderer } from './BlockRenderer'

export function Canvas() {
    const blocks = useBuilderStore((state) => state.blocks)

    return (
        <div className="canvas min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-4">
                {blocks.length === 0 ? (
                    <p className="text-muted-foreground text-center">No blocks yet. Add one to get started.</p>
                ) : (
                    blocks.map((block) => (
                        <BlockRenderer key={block.id} block={block} />
                    ))
                )}
            </div>
        </div>
    )
}
