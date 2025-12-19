"use client"

import { useState } from "react"
import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { LinkBlock } from "./link-block"
import { VideoBlock } from "./blocks/video-block"
import { AudioBlock } from "./blocks/audio-block"
import { HeaderBlock } from "./blocks/header-block"
import { GalleryBlock } from "./blocks/gallery-block"
import { TimerBlock } from "./blocks/timer-block"
import { NewsletterBlock } from "./blocks/newsletter-block"
import { TextBlock } from "./blocks/text-block"
import { MapBlock } from "./blocks/map-block"
import { SocialsBlock } from "./blocks/socials-block"
import { ContactBlock } from "./blocks/contact-block"
import { CalendlyBlock } from "./blocks/calendly-block"
import { EmbedBlock } from "./blocks/embed-block"
import { CommerceBlock } from "./blocks/commerce-block"
import { CommerceForm } from "./forms/commerce-form"
import { SizeSelector, BlockVariant } from "./editors/size-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Trash2,
    Pencil,
    GripVertical,
    GripHorizontal,
    Check,
    ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

// Common Props for all blocks
interface BlockProps {
    id: string
    data: BuilderBlock['content']
}

export function BlockRenderer({ block }: { block: BuilderBlock }) {
    const { updateBlock, removeBlock, updateLayout, blocks } = useBuilderStore()
    const [isOpen, setIsOpen] = useState(false)

    // Derived State
    const { id, type, content } = block
    const isInteractive = ['video', 'audio', 'gallery'].includes(type)

    // --- Render Content based on Type ---
    const renderBlockContent = () => {
        switch (type) {
            case 'link':
                return <LinkBlock id={id} data={content} layout={block.layout} />
            case 'video':
                return <VideoBlock id={id} data={content} />
            case 'audio':
                return <AudioBlock id={id} data={content} />
            case 'gallery':
                return <GalleryBlock id={id} data={content} />
            case 'header':
                return <HeaderBlock id={id} data={content} />
            case 'timer':
                return <TimerBlock id={id} data={content} />
            case 'newsletter':
                return <NewsletterBlock id={id} data={content} />
            case 'text':
                return <TextBlock id={id} data={content} />
            case 'map':
                return <MapBlock id={id} data={content} />
            case 'socials':
                return <SocialsBlock id={id} data={content} />
            case 'contact':
                return <ContactBlock id={id} data={content} />
            case 'calendly':
                return <CalendlyBlock id={id} data={content} />
            case 'embed':
                return <EmbedBlock id={id} data={content} />
            case 'commerce':
                return <CommerceBlock id={id} data={content} />
            default:
                return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Unknown Block Type</div>
        }
    }

    // --- Render Editor Form based on Type ---
    // Helper to handle size changes
    const handleSizeChange = (newVariant: BlockVariant) => {
        let w = block.layout.w
        let h = block.layout.h

        switch (newVariant) {
            case 'icon': w = 1; h = 2; break;     // 1x2
            case 'square': w = 2; h = 4; break;   // 2x4
            case 'classic':
                w = 6;
                // Special case: Header "Bar" needs more height for avatar (3 rows vs 1)
                h = type === 'header' ? 3 : 1;
                break;
            case 'wide': w = 4; h = 2; break;     // 4x2
            case 'hero': w = 6; h = 5; break;     // 6x5
        }

        // Special override for Commerce if needed, but 'hero' default covers it.
        // Actually, commerce-form.tsx handles its own layout updates now,
        // so this handleSizeChange might be bypassed if CommerceForm uses its own logic.
        // But since we are rendering CommerceForm in the renderEditorFields,
        // we should make sure CommerceForm is used correctly. 
        // Note: CommerceForm implementation created earlier duplicated this logic.
        // It's fine for now.

        updateBlock(id, { variant: newVariant })

        // Update Layout
        const newLayouts = blocks.map(b =>
            b.id === id ? { ...b.layout, w, h } : b.layout
        )
        updateLayout(newLayouts)
    }

    // --- Render Editor Form based on Type ---
    const renderEditorFields = () => {
        switch (type) {
            case 'header':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'classic'}
                            onSelect={handleSizeChange}
                            allowedVariants={['square', 'wide', 'hero', 'classic']}
                        />
                        <div className="space-y-2">
                            <Label>Profile Name</Label>
                            <Input
                                value={content.title}
                                onChange={(e) => updateBlock(id, { title: e.target.value })}
                                placeholder="e.g. Jane Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio / Description</Label>
                            <Textarea
                                value={content.description || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateBlock(id, { description: e.target.value })}
                                placeholder="Short bio..."
                                className="h-20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Avatar URL</Label>
                            <Input
                                value={content.thumbnail || ''}
                                onChange={(e) => updateBlock(id, { thumbnail: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                )
            case 'video':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'classic'}
                            onSelect={handleSizeChange}
                            allowedVariants={['square', 'wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Video URL</Label>
                            <Input
                                value={content.embedUrl || ''}
                                onChange={(e) => updateBlock(id, { embedUrl: e.target.value })}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                            <p className="text-[10px] text-slate-500">
                                Supports YouTube and Vimeo.
                            </p>
                        </div>
                    </div>
                )
            case 'audio':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'classic'}
                            onSelect={handleSizeChange}
                            allowedVariants={['square', 'wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Audio URL</Label>
                            <Input
                                value={content.embedUrl || ''}
                                onChange={(e) => updateBlock(id, { embedUrl: e.target.value })}
                                placeholder="https://open.spotify.com/track/..."
                            />
                        </div>
                    </div>
                )
            case 'gallery':
                return (
                    <div className="space-y-4">
                        <SizeSelector
                            currentVariant={content.variant || 'wide'}
                            onSelect={handleSizeChange}
                            allowedVariants={['square', 'wide', 'hero']} // Restrict gallery sizes
                        />

                        {/* Display Type Toggle */}
                        <div className="space-y-2">
                            <Label>Display Type</Label>
                            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => updateBlock(id, { galleryType: 'carousel' })}
                                    className={cn(
                                        "py-1.5 px-2 rounded-md text-[10px] font-medium transition-all text-center",
                                        content.galleryType === 'carousel' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    3D
                                </button>
                                <button
                                    onClick={() => updateBlock(id, { galleryType: 'accordion' })}
                                    className={cn(
                                        "py-1.5 px-2 rounded-md text-[10px] font-medium transition-all text-center",
                                        content.galleryType === 'accordion' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Accord
                                </button>
                                <button
                                    onClick={() => updateBlock(id, { galleryType: 'creative' })}
                                    className={cn(
                                        "py-1.5 px-2 rounded-md text-[10px] font-medium transition-all text-center",
                                        content.galleryType === 'creative' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => updateBlock(id, { galleryType: 'stack' })}
                                    className={cn(
                                        "py-1.5 px-2 rounded-md text-[10px] font-medium transition-all text-center",
                                        content.galleryType === 'stack' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Stack
                                </button>
                            </div>
                        </div>

                        {/* Image Manager */}
                        <div className="space-y-2">
                            <Label>Images</Label>
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                {content.images?.map((img, index) => (
                                    <div key={img.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-100 group/item">
                                        <div className="h-10 w-10 flex-shrink-0 bg-slate-200 rounded overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img.url} className="h-full w-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Input
                                                value={img.url}
                                                onChange={(e) => {
                                                    const newImages = [...(content.images || [])]
                                                    newImages[index] = { ...img, url: e.target.value }
                                                    updateBlock(id, { images: newImages })
                                                }}
                                                className="h-8 text-xs font-mono"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                                            onClick={() => {
                                                const newImages = (content.images || []).filter(item => item.id !== img.id)
                                                updateBlock(id, { images: newImages })
                                            }}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => {
                                    const newImage = {
                                        id: crypto.randomUUID(),
                                        url: `https://picsum.photos/seed/${crypto.randomUUID()}/800/600`, // Higher res placeholder
                                        alt: 'New Image'
                                    }
                                    updateBlock(id, { images: [...(content.images || []), newImage] })
                                }}
                            >
                                + Add Image
                            </Button>
                        </div>
                    </div>
                )
            case 'link':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'classic'}
                            onSelect={handleSizeChange}
                        />

                        <div className="space-y-1">
                            <Label>Title</Label>
                            <Input
                                value={content.title}
                                onChange={(e) => updateBlock(id, { title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>URL</Label>
                            <Input
                                value={content.url}
                                onChange={(e) => updateBlock(id, { url: e.target.value })}
                            />
                        </div>
                    </div>
                )
            case 'timer':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'wide'}
                            onSelect={handleSizeChange}
                            allowedVariants={['square', 'wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Target Date</Label>
                            <Input
                                type="datetime-local"
                                value={content.targetDate ? new Date(content.targetDate).toISOString().slice(0, 16) : ''}
                                onChange={(e) => updateBlock(id, { targetDate: new Date(e.target.value).toISOString() })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                                value={content.timerLabel || ''}
                                onChange={(e) => updateBlock(id, { timerLabel: e.target.value })}
                            />
                        </div>
                    </div>
                )
            case 'newsletter':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'wide'}
                            onSelect={handleSizeChange}
                            allowedVariants={['wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Placeholder</Label>
                            <Input
                                value={content.placeholderText || ''}
                                onChange={(e) => updateBlock(id, { placeholderText: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                                value={content.buttonText || ''}
                                onChange={(e) => updateBlock(id, { buttonText: e.target.value })}
                            />
                        </div>
                    </div>
                )
            case 'calendly':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'wide'}
                            onSelect={handleSizeChange}
                            allowedVariants={['hero', 'wide']}
                        />
                        <div className="space-y-2">
                            <Label>Calendly URL</Label>
                            <Input
                                value={content.calendlyUrl || ''}
                                onChange={(e) => updateBlock(id, { calendlyUrl: e.target.value })}
                                placeholder="https://calendly.com/your/event"
                            />
                            <a
                                href="https://calendly.com/app/event_types/user/me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline mt-1 block flex items-center gap-1"
                            >
                                Get your link from Calendly <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                )
            case 'embed':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'hero'}
                            onSelect={handleSizeChange}
                            allowedVariants={['square', 'wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Website or Embed URL</Label>
                            <Input
                                value={content.embedUrl || ''}
                                onChange={(e) => updateBlock(id, { embedUrl: e.target.value })}
                                placeholder="https://..."
                            />
                            <p className="text-[10px] text-slate-500">
                                Paste the URL of the page you want to show (e.g. https://cal.com/me)
                            </p>
                        </div>
                    </div>
                )
            case 'text':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'wide'}
                            onSelect={handleSizeChange}
                            allowedVariants={['wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={content.textTitle || ''}
                                onChange={(e) => updateBlock(id, { textTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                                value={content.textContent || ''}
                                onChange={(e) => updateBlock(id, { textContent: e.target.value })}
                                className="h-20"
                            />
                        </div>
                    </div>
                )
            case 'map':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'wide'}
                            onSelect={handleSizeChange}
                            allowedVariants={['square', 'wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                                value={content.address || ''}
                                onChange={(e) => updateBlock(id, { address: e.target.value })}
                                placeholder="Times Square, NY"
                            />
                        </div>
                    </div>
                )
            case 'contact':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'hero'}
                            onSelect={handleSizeChange}
                            allowedVariants={['wide', 'hero']}
                        />
                        <div className="space-y-2">
                            <Label>Receiver Email</Label>
                            <Input
                                value={content.contactEmail || ''}
                                onChange={(e) => updateBlock(id, { contactEmail: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                                value={content.submitButtonText || ''}
                                onChange={(e) => updateBlock(id, { submitButtonText: e.target.value })}
                            />
                        </div>
                    </div>
                )
            case 'socials':
                return (
                    <div className="space-y-3">
                        <SizeSelector
                            currentVariant={content.variant || 'wide'}
                            onSelect={handleSizeChange}
                            allowedVariants={['wide']}
                        />
                        <div className="space-y-2">
                            <Label>Links</Label>
                            <div className="text-xs text-slate-500 mb-2">
                                Add platform links below.
                            </div>
                            {/* Simple list manager */}
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {content.socialLinks?.map((link, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <select
                                            className="h-8 text-xs bg-slate-50 border border-slate-200 rounded px-1 w-24"
                                            value={link.platform}
                                            onChange={(e) => {
                                                const newLinks = [...(content.socialLinks || [])]
                                                newLinks[index] = { ...link, platform: e.target.value as any }
                                                updateBlock(id, { socialLinks: newLinks })
                                            }}
                                        >
                                            <option value="instagram">Insta</option>
                                            <option value="twitter">Twit</option>
                                            <option value="linkedin">Linkd</option>
                                            <option value="github">Git</option>
                                            <option value="youtube">YT</option>
                                            <option value="website">Web</option>
                                        </select>
                                        <Input
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...(content.socialLinks || [])]
                                                newLinks[index] = { ...link, url: e.target.value }
                                                updateBlock(id, { socialLinks: newLinks })
                                            }}
                                            className="h-8 text-xs"
                                            placeholder="URL..."
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                                            onClick={() => {
                                                const newLinks = (content.socialLinks || []).filter((_, i) => i !== index)
                                                updateBlock(id, { socialLinks: newLinks })
                                            }}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={() => {
                                        const newLink = { platform: 'instagram', url: '' } as any
                                        updateBlock(id, { socialLinks: [...(content.socialLinks || []), newLink] })
                                    }}
                                >
                                    + Add Link
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            case 'commerce':
                return <CommerceForm id={id} data={content} />
            default:
                return null
        }
    }

    return (
        <div
            className={cn(
                "relative group w-full h-full outline-none",
                !content.isActive && "opacity-60 grayscale",
                // Non-interactive blocks (Link, Header, Timer, Newsletter) are draggable by body
                !isInteractive && "drag-handle cursor-grab active:cursor-grabbing"
            )}
            data-id={`builder-block-${id}`}
        >
            {/* Floating Drag Handle - Only for interactive blocks (Video, Audio, Gallery) */}
            {isInteractive && (
                <div className="drag-handle absolute -top-5 left-1/2 -translate-x-1/2 z-50 cursor-grab active:cursor-grabbing p-1 px-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-50 flex items-center justify-center">
                    <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
                </div>
            )}

            {/* Render the actual block content */}
            {renderBlockContent()}

            {/* Editor Overlay (Generic for ALL blocks) */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "absolute -top-5 right-2 z-50 h-7 w-7 rounded-full shadow-sm bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white",
                            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                            isOpen && "opacity-100" // Keep visible when open
                        )}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent drag
                        onClick={(e) => e.stopPropagation()} // Prevent click
                        title="Edit Block"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    side="left"
                    align="start"
                    className="w-80 z-[100] p-4"
                    onInteractOutside={(e) => {
                        // Logic to close
                    }}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-sm font-semibold text-slate-900 capitalize">
                                Edit {type} Block
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBlock(id)}
                                className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                title="Delete Block"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        {/* Dynamic Fields */}
                        <div className="flex-1 min-w-0">
                            {renderEditorFields()}
                        </div>

                        {/* Footer (Visibility) */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id={`block-active-${id}`}
                                    checked={content.isActive}
                                    onCheckedChange={(checked) => updateBlock(id, { isActive: checked })}
                                    className="scale-75 origin-left"
                                />
                                <Label htmlFor={`block-active-${id}`} className="text-xs text-slate-500 font-medium">
                                    {content.isActive ? 'Visible' : 'Hidden'}
                                </Label>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
