'use client'

import { useBuilderStore } from '@/store/builderStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function PropertiesPanel() {
    const selectedBlockId = useBuilderStore((state) => state.selectedBlockId)
    const blocks = useBuilderStore((state) => state.blocks)
    const updateBlock = useBuilderStore((state) => state.updateBlock)

    const selectedBlock = blocks.find(b => b.id === selectedBlockId)

    if (!selectedBlock) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                <p>Select a block to edit its properties</p>
            </div>
        )
    }

    const handleContentChange = (value: string) => {
        updateBlock(selectedBlock.id, { content: value })
    }

    return (
        <div className="p-4 space-y-6">
            <div>
                <h2 className="font-semibold mb-2">Block Properties</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Editing {selectedBlock.type} block
                </p>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                {selectedBlock.type === 'paragraph' ? (
                    <Textarea
                        id="content"
                        value={selectedBlock.content || ''}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder={`Enter ${selectedBlock.type} content...`}
                        rows={4}
                    />
                ) : (
                    <Input
                        id="content"
                        value={selectedBlock.content || ''}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder={`Enter ${selectedBlock.type} content...`}
                    />
                )}
            </div>
        </div>
    )
}
