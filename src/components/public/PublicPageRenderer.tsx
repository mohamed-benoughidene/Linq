'use client';

import { Block } from '@/types/builder';
import { cn } from '@/lib/utils';
import { PageWithProfile } from '@/types/database';

interface PublicPageRendererProps {
    page: PageWithProfile;
}

export function PublicPageRenderer({ page }: PublicPageRendererProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container max-w-4xl mx-auto py-6 px-4">
                    <div className="flex items-center gap-4">
                        {page.profiles.avatar_url && (
                            <img
                                src={page.profiles.avatar_url}
                                alt={page.profiles.full_name || page.profiles.username}
                                className="w-16 h-16 rounded-full"
                            />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold">{page.title}</h1>
                            <p className="text-muted-foreground">@{page.profiles.username}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Blocks */}
            <main className="container max-w-4xl mx-auto py-8 px-4">
                <div className="space-y-4">
                    {page.blocks.length === 0 ? (
                        <p className="text-center text-muted-foreground">This page is empty.</p>
                    ) : (
                        page.blocks.map((block) => (
                            <PublicBlockRenderer key={block.id} block={block} />
                        ))
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-16">
                <div className="container max-w-4xl mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
                    <p>Made with <a href="/" className="underline">Linq</a></p>
                </div>
            </footer>
        </div>
    );
}

function PublicBlockRenderer({ block }: { block: Block }) {
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
    };

    const className = cn(
        block.microInteractions.hover,
        block.microInteractions.click,
        block.microInteractions.scroll,
        'transition-all'
    );

    switch (block.type) {
        case 'heading':
            return <h1 style={combinedStyles} className={className}>{block.content || 'Heading'}</h1>;
        case 'paragraph':
            return <p style={combinedStyles} className={className}>{block.content || 'Paragraph'}</p>;
        case 'image':
            return (
                <img
                    src={block.imageUrl || block.content || 'https://via.placeholder.com/400x300'}
                    alt={block.imageDescription || 'Image'}
                    style={combinedStyles}
                    className={className}
                />
            );
        case 'link':
            return (
                <a
                    href={block.linkUrl || block.content || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={combinedStyles}
                    className={className}
                >
                    {block.linkText || block.content || 'Link'}
                </a>
            );
        default:
            return null;
    }
}
