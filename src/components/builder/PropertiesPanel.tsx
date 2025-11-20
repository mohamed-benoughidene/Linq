'use client'

import { useBuilderStore } from '@/store/builderStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react'

export function PropertiesPanel() {
    const selectedBlockId = useBuilderStore((state) => state.selectedBlockId)
    const blocks = useBuilderStore((state) => state.blocks)
    const updateBlock = useBuilderStore((state) => state.updateBlock)
    const deleteBlock = useBuilderStore((state) => state.deleteBlock)
    const selectBlock = useBuilderStore((state) => state.selectBlock)
    const moveBlockUp = useBuilderStore((state) => state.moveBlockUp)
    const moveBlockDown = useBuilderStore((state) => state.moveBlockDown)

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

    const handleStyleChange = (property: string, value: any) => {
        updateBlock(selectedBlock.id, {
            styles: {
                ...selectedBlock.styles,
                [property]: value
            }
        })
    }

    return (
        <div className="p-4 space-y-6">
            <div>
                <h2 className="font-semibold mb-2">Block Properties</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Editing {selectedBlock.type} block
                </p>
            </div>

            {/* Reorder Buttons */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => moveBlockUp(selectedBlock.id)}
                    disabled={blocks.findIndex(b => b.id === selectedBlock.id) === 0}
                >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Move Up
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => moveBlockDown(selectedBlock.id)}
                    disabled={blocks.findIndex(b => b.id === selectedBlock.id) === blocks.length - 1}
                >
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Move Down
                </Button>
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

            {/* Style Controls */}
            <div className="space-y-4">
                <h3 className="font-medium text-sm">Typography</h3>

                <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size (px)</Label>
                    <Input
                        id="fontSize"
                        type="number"
                        value={selectedBlock.styles.fontSize || 16}
                        onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                        min={8}
                        max={96}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <select
                        id="fontFamily"
                        value={selectedBlock.styles.fontFamily || 'Inter'}
                        onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fontWeight">Font Weight</Label>
                    <select
                        id="fontWeight"
                        value={selectedBlock.styles.fontWeight || 400}
                        onChange={(e) => handleStyleChange('fontWeight', parseInt(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value={300}>Light (300)</option>
                        <option value={400}>Normal (400)</option>
                        <option value={500}>Medium (500)</option>
                        <option value={600}>Semibold (600)</option>
                        <option value={700}>Bold (700)</option>
                        <option value={800}>Extrabold (800)</option>
                    </select>
                </div>
            </div>

            {/* Color Controls */}
            <div className="space-y-4">
                <h3 className="font-medium text-sm">Colors</h3>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <Label htmlFor="color">Text Color</Label>
                        <Input
                            id="color"
                            type="color"
                            value={selectedBlock.styles.color || '#000000'}
                            onChange={(e) => handleStyleChange('color', e.target.value)}
                            className="h-10 cursor-pointer"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background</Label>
                        <Input
                            id="backgroundColor"
                            type="color"
                            value={selectedBlock.styles.backgroundColor || '#FFFFFF'}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                            className="h-10 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Spacing Controls */}
            <div className="space-y-4">
                <h3 className="font-medium text-sm">Spacing</h3>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <Label htmlFor="margin">Margin (px)</Label>
                        <Input
                            id="margin"
                            type="number"
                            value={selectedBlock.styles.margin || 0}
                            onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
                            min={0}
                            max={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="padding">Padding (px)</Label>
                        <Input
                            id="padding"
                            type="number"
                            value={selectedBlock.styles.padding || 0}
                            onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>
            </div>

            {/* Delete Button */}
            <div className="pt-4 border-t">
                <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                        deleteBlock(selectedBlock.id)
                        selectBlock(null)
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Block
                </Button>
            </div>
        </div>
    )
}
