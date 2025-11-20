'use client'

import { useBuilderStore } from '@/store/builderStore'
import { BlockRenderer } from './BlockRenderer'

export function Canvas() {
    const { blocks, selectBlock } = useBuilderStore()

    return (
        <div className="canvas min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-4">
                {blocks.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                        No blocks yet. Add one from the sidebar!
                    </p>
                ) : (
                    blocks.map((block) => (
                        <BlockRenderer
                            key={block.id}
                            block={block}
                            onClick={() => selectBlock(block.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
