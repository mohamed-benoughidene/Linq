'use client'

import { useBuilderStore } from '@/store/builderStore'

export function PropertiesPanel() {
    const selectedBlockId = useBuilderStore((state) => state.selectedBlockId)
    const blocks = useBuilderStore((state) => state.blocks)

    const selectedBlock = blocks.find(b => b.id === selectedBlockId)

    if (!selectedBlock) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                <p>Select a block to edit its properties</p>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            <div>
                <h2 className="font-semibold mb-2">Block Properties</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Editing {selectedBlock.type} block
                </p>

                {/* Controls will go here */}
                <div className="text-xs text-muted-foreground">
                    ID: {selectedBlock.id}
                </div>
            </div>
        </div>
    )
}
