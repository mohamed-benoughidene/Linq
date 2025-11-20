'use client'

import { Block } from '@/types/builder'
import { cn } from '@/lib/utils'

interface BlockRendererProps {
    block: Block
    onClick?: () => void
}

export function BlockRenderer({ block, onClick }: BlockRendererProps) {
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
        'cursor-pointer transition-all'
    )

    switch (block.type) {
        case 'heading':
            return (
                <h1 style={combinedStyles} className={className} onClick={onClick}>
                    {block.content || 'Heading'}
                </h1>
            )
        case 'paragraph':
            return (
                <p style={combinedStyles} className={className} onClick={onClick}>
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
                    onClick={onClick}
                />
            )
        case 'link':
            return (
                <a
                    href={block.content || '#'}
                    style={combinedStyles}
                    className={className}
                    onClick={onClick}
                >
                    {block.content || 'Link'}
                </a>
            )
        default:
            return null
    }
}
