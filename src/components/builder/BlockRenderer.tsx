'use client'

import { Block } from '@/types/builder'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import { useComponentId } from '@/lib/component-id'
import { buildBackgroundStyle } from '@/lib/gradientUtils'

interface BlockRendererProps {
    block: Block
    onClick?: (e: React.MouseEvent) => void
}

export function BlockRenderer({ block, onClick }: BlockRendererProps) {
    const componentId = useComponentId("BlockRenderer")
    const backgroundStyle = buildBackgroundStyle(block.backgroundConfig || { type: 'color', color: block.styles.backgroundColor })

    // HYBRID STYLING: Inline for custom values
    const combinedStyles = {
        ...backgroundStyle,
        fontSize: block.styles.fontSize ? `${block.styles.fontSize}px` : undefined,
        color: block.styles.color,
        // Remove direct backgroundColor assignment as it's handled by buildBackgroundStyle (via backgroundConfig)
        // But keep fallback if needed (though buildBackgroundStyle handles it)
        fontFamily: block.styles.fontFamily,
        fontWeight: block.styles.fontWeight,
        margin: block.styles.margin ? `${block.styles.margin}px` : undefined,
        padding: block.styles.padding ? `${block.styles.padding}px` : undefined,
        borderWidth: block.styles.borderWidth ? `${block.styles.borderWidth}px` : undefined,
        borderColor: block.styles.borderColor,
        borderRadius: block.styles.borderRadius ? `${block.styles.borderRadius}px` : undefined,
        borderStyle: block.styles.borderWidth ? 'solid' : undefined,
        textAlign: block.styles.textAlign || (block.type === 'link' ? 'center' : 'left'),
    }

    // HYBRID STYLING: Tailwind classes for micro-interactions
    const className = cn(
        block.microInteractions?.hover,
        block.microInteractions?.click,
        block.microInteractions?.scroll,
        'cursor-pointer transition-all'
    )

    switch (block.type) {
        case 'heading':
            return (
                <h1 style={combinedStyles} className={className} onClick={onClick} data-component-id={componentId}>
                    {block.content || 'Heading'}
                </h1>
            )
        case 'paragraph':
            return (
                <p style={combinedStyles} className={className} onClick={onClick} data-component-id={componentId}>
                    {block.content || 'Paragraph'}
                </p>
            )
        case 'image':
            // Use imageUrl if available, otherwise show placeholder
            const hasImage = block.imageUrl && block.imageUrl.trim() !== ''

            return (
                <div style={combinedStyles} className={className} onClick={onClick} data-component-id={componentId}>
                    {hasImage ? (
                        <img
                            src={block.imageUrl}
                            alt={block.imageDescription || ''}
                            className="w-full h-auto object-cover"
                        />
                    ) : (
                        // Skeleton placeholder when no image URL
                        <div className="flex flex-col items-center justify-center bg-muted rounded-md border-2 border-dashed border-muted-foreground/20 p-8 min-h-[200px]">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/40 mb-2" />
                            <p className="text-sm text-muted-foreground/60">No image URL</p>
                            <p className="text-xs text-muted-foreground/40 mt-1">Click to add image</p>
                        </div>
                    )}
                    {/* Show description only if it exists and has content */}
                    {block.imageDescription && block.imageDescription.trim() !== '' && (
                        <p className="text-sm text-muted-foreground mt-2">{block.imageDescription}</p>
                    )}
                </div>
            )
        case 'link':
            // Use linkUrl and linkText if available
            const url = block.linkUrl && block.linkUrl.trim() !== '' ? block.linkUrl : '#'
            const linkDisplay = block.linkText && block.linkText.trim() !== '' ? block.linkText : (block.linkUrl || 'Link')

            return (
                <a
                    href={url}
                    style={combinedStyles}
                    className={cn(className, 'block text-center')}
                    onClick={(e) => {
                        // Prevent navigation when editing
                        e.preventDefault()
                        onClick?.(e)
                    }}
                >
                    {linkDisplay}
                </a>
            )
        default:
            return null
    }
}
