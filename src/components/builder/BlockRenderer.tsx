'use client'

import { Block } from '@/types/builder'
import { cn } from '@/lib/utils'
import { useBuilderStore } from '@/store/builderStore'

interface BlockRendererProps {
    block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
    const selectedBlockId = useBuilderStore((state) => state.selectedBlockId)
    const selectBlock = useBuilderStore((state) => state.selectBlock)

    const isSelected = selectedBlockId === block.id

    const combinedStyles = {
        fontSize: block.styles.fontSize ? `${block.styles.fontSize}px` : undefined,
        color: block.styles.color,
        backgroundColor: block.styles.backgroundColor,
        fontFamily: block.styles.fontFamily,
        fontWeight: block.styles.fontWeight,
        margin: block.styles.margin ? `${block.styles.margin}px` : undefined,
        padding: block.styles.padding ? `${block.styles.padding}px` : undefined,
        borderWidth: block.styles.borderWidth ? `${block.styles.borderWidth}px` : undefined,
        borderColor: block.styles.borderColor,
        borderRadius: block.styles.borderRadius ? `${block.styles.borderRadius}px` : undefined,
        borderStyle: block.styles.borderWidth ? 'solid' : undefined,
    }

    const className = cn(
        block.microInteractions.hover,
        block.microInteractions.click,
        block.microInteractions.scroll,
        'cursor-pointer transition-all relative',
        isSelected && 'ring-2 ring-primary ring-offset-2'
    )

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        selectBlock(block.id)
    }

    switch (block.type) {
        case 'heading':
            return (
                <h1 style={combinedStyles} className={className} onClick={handleClick}>
                    {block.content || 'Heading'}
                </h1>
            )
        case 'paragraph':
            return (
                <p style={combinedStyles} className={className} onClick={handleClick}>
                    {block.content || 'Paragraph'}
                </p>
            )
        case 'image':
            return (
                <img
                    src={block.content || 'https://via.placeholder.com/400x300'}
                    alt=""
                    style={combinedStyles}
                    className={className}
                    onClick={handleClick}
                />
            )
        case 'link':
            return (
                <a
                    href={block.content || '#'}
                    style={combinedStyles}
                    className={className}
                    onClick={handleClick}
                >
                    {block.content || 'Link'}
                </a>
            )
        default:
            return null
    }
}
