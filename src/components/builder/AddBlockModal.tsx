'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Type, AlignLeft, Image, Link } from 'lucide-react'
import { BlockType } from '@/types/builder'

interface AddBlockModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelectBlock: (type: BlockType) => void
}

export function AddBlockModal({ open, onOpenChange, onSelectBlock }: AddBlockModalProps) {
    const blockTypes = [
        { type: 'heading' as BlockType, icon: Type, label: 'Heading' },
        { type: 'paragraph' as BlockType, icon: AlignLeft, label: 'Paragraph' },
        { type: 'image' as BlockType, icon: Image, label: 'Image' },
        { type: 'link' as BlockType, icon: Link, label: 'Link' },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Static Block</DialogTitle>
                    <DialogDescription>
                        Choose a block type to add to your page
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    {blockTypes.map(({ type, icon: Icon, label }) => (
                        <button
                            key={type}
                            onClick={() => {
                                onSelectBlock(type)
                                onOpenChange(false)
                            }}
                            className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors"
                        >
                            <Icon className="h-8 w-8" />
                            <span className="text-sm font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
