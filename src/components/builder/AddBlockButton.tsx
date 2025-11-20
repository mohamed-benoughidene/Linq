'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBuilderStore } from '@/store/builderStore'
import { BlockType } from '@/types/builder'

export function AddBlockButton() {
    const addBlock = useBuilderStore((state) => state.addBlock)

    const handleAddBlock = (type: BlockType) => {
        const newBlock = {
            id: crypto.randomUUID(),
            type,
            content: '',
            styles: {
                fontSize: type === 'heading' ? 32 : 16,
                color: '#000000',
                backgroundColor: 'transparent',
                padding: 16,
                margin: 0,
            },
            microInteractions: {
                hover: '',
                click: '',
                scroll: '',
            },
        }
        addBlock(newBlock)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Block
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem onClick={() => handleAddBlock('heading')}>
                    Heading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddBlock('paragraph')}>
                    Paragraph
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddBlock('image')}>
                    Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddBlock('link')}>
                    Link
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
