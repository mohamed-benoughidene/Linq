'use client'

import { useState, useEffect } from 'react'
import { Block } from '@/types/builder'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBuilderStore } from '@/store/builderStore'
import { useDebounceCallback } from 'usehooks-ts'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Lock, Unlock, ChevronDown, Trash2, Upload, Loader2, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { uploadImage } from '@/lib/storage'
import { themes } from '@/lib/themes'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from '@/components/ui/sidebar'
import { getContrastTextColor } from '@/lib/colorUtils'
import { useComponentId } from '@/lib/component-id'

interface BlockEditorProps {
    block: Block
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
    const componentId = useComponentId("BlockEditor")
    const [isMobile, setIsMobile] = useState(false)
    const [content, setContent] = useState(block.content)
    const { updateBlock, applyBlockTheme, deleteBlock } = useBuilderStore()
    const [isUploading, setIsUploading] = useState(false)

    // Collapsible state
    const [themeOpen, setThemeOpen] = useState(true)
    const [microOpen, setMicroOpen] = useState(false)
    const [typographyOpen, setTypographyOpen] = useState(false)
    const [spacingOpen, setSpacingOpen] = useState(false)
    const [bgOpen, setBgOpen] = useState(false)
    const [borderOpen, setBorderOpen] = useState(false)

    // Sync local state ONLY when switching to a different block
    useEffect(() => {
        setContent(block.content)
    }, [block.id])

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Debounced update
    const debouncedUpdate = useDebounceCallback((newContent: string) => {
        updateBlock(block.id, { content: newContent })
    }, 500)

    const handleContentChange = (newContent: string) => {
        setContent(newContent)
        debouncedUpdate(newContent)
    }

    const handleStyleChange = (property: keyof Block['styles'], value: string | number) => {
        const updates: Partial<Block> = {
            styles: { ...block.styles, [property]: value }
        }

        // Auto-adjust text color when background changes
        if (property === 'backgroundColor' && typeof value === 'string') {
            updates.styles!.color = getContrastTextColor(value)
        }

        updateBlock(block.id, updates)
    }

    const toggleThemeLock = () => {
        updateBlock(block.id, { themeLocked: !block.themeLocked })
    }

    const handleApplyBlockTheme = (theme: any) => {
        if (!theme) return
        applyBlockTheme(block.id, theme)
        toast.success('Theme applied', {
            description: 'Theme applied to this block only',
        })
    }

    const toggleMicroInteractionsLock = () => {
        updateBlock(block.id, { microInteractionsLocked: !block.microInteractionsLocked })
    }

    const editorContent = (
        <div className="space-y-4 h-full overflow-y-auto px-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">Edit {block.type}</h4>
            </div>

            {/* Image Block - Separate URL and Description */}
            {block.type === 'image' && (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Image</Label>

                        {block.imageUrl ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                                <img
                                    src={block.imageUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2 h-6 w-6"
                                    onClick={() => updateBlock(block.id, { imageUrl: '' })}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full h-24 border-dashed flex flex-col gap-2"
                                    disabled={isUploading}
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Click to upload image</span>
                                        </>
                                    )}
                                </Button>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return

                                        setIsUploading(true)
                                        const url = await uploadImage(file)
                                        setIsUploading(false)

                                        if (url) {
                                            updateBlock(block.id, { imageUrl: url })
                                            toast.success('Image uploaded successfully')
                                        } else {
                                            toast.error('Failed to upload image')
                                        }
                                    }}
                                />
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-border" />
                                    <span className="text-[10px] text-muted-foreground uppercase">Or via URL</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <Input
                                    value={block.imageUrl || ''}
                                    onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="h-8 text-xs"
                                />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageDescription">Description (Optional)</Label>
                        <Textarea
                            id="imageDescription"
                            value={block.imageDescription || ''}
                            onChange={(e) => updateBlock(block.id, { imageDescription: e.target.value })}
                            placeholder="Image description or caption..."
                            className="min-h-[60px]"
                        />
                    </div>
                </div>
            )}

            {/* Link Block - Separate URL and Display Text */}
            {block.type === 'link' && (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="linkUrl">Link URL</Label>
                        <Input
                            id="linkUrl"
                            value={block.linkUrl || ''}
                            onChange={(e) => updateBlock(block.id, { linkUrl: e.target.value })}
                            placeholder="https://example.com"
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkText">Display Text</Label>
                        <Input
                            id="linkText"
                            value={block.linkText || ''}
                            onChange={(e) => updateBlock(block.id, { linkText: e.target.value })}
                            placeholder="Click here"
                            className="h-9"
                        />
                    </div>
                </div>
            )}

            {/* Other Block Types - Standard Content */}
            {block.type !== 'image' && block.type !== 'link' && (
                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder={`Enter ${block.type} content...`}
                        className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                        Changes save automatically after you stop typing
                    </p>
                </div>
            )}

            {/* Theme Section - SidebarMenu */}
            <div className="border-t pt-4">
                <SidebarMenu>
                    <Collapsible open={themeOpen} onOpenChange={setThemeOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <div className="flex items-center gap-2">
                                        {block.themeLocked ? (
                                            <Lock className="h-4 w-4" />
                                        ) : (
                                            <Unlock className="h-4 w-4" />
                                        )}
                                        <span>Theme</span>
                                    </div>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub className="px-4 py-2 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs">Lock Theme</Label>
                                        <Switch
                                            checked={block.themeLocked}
                                            onCheckedChange={toggleThemeLock}
                                        />
                                    </div>

                                    {!block.themeLocked && (
                                        <p className="text-xs text-muted-foreground">
                                            Lock to prevent global theme changes
                                        </p>
                                    )}

                                    {block.themeLocked && (
                                        <div className="bg-muted/50 p-3 rounded-md space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                                                <Lock className="h-3 w-3" />
                                                Quick Theme Apply
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {Object.values(themes).map((theme) => (
                                                    <Button
                                                        key={theme.name}
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 text-[10px] px-1"
                                                        onClick={() => handleApplyBlockTheme(theme)}
                                                    >
                                                        {theme.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </div>

            {/* Micro-Interactions Section - SidebarMenu */}
            <div className="border-t pt-4">
                <SidebarMenu>
                    <Collapsible open={microOpen} onOpenChange={setMicroOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <span>Micro-Interactions</span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub className="px-4 py-2 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs">Lock Interactions</Label>
                                        <Switch
                                            checked={block.microInteractionsLocked}
                                            onCheckedChange={toggleMicroInteractionsLock}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs">Hover Effect</Label>
                                        <Select
                                            value={block.microInteractions?.hover || " "}
                                            onValueChange={(value) => updateBlock(block.id, {
                                                microInteractions: { ...block.microInteractions, hover: value === " " ? "" : value }
                                            })}
                                            disabled={!block.microInteractionsLocked}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value=" ">None</SelectItem>
                                                <SelectItem value="hover:scale-105">Scale Up</SelectItem>
                                                <SelectItem value="hover:scale-95">Scale Down</SelectItem>
                                                <SelectItem value="hover:opacity-80">Fade</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs">Click Animation</Label>
                                        <Select
                                            value={block.microInteractions?.click || " "}
                                            onValueChange={(value) => updateBlock(block.id, {
                                                microInteractions: { ...block.microInteractions, click: value === " " ? "" : value }
                                            })}
                                            disabled={!block.microInteractionsLocked}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value=" ">None</SelectItem>
                                                <SelectItem value="active:scale-95">Shrink</SelectItem>
                                                <SelectItem value="active:scale-105">Grow</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs">Scroll Animation</Label>
                                        <Select
                                            value={block.microInteractions?.scroll || " "}
                                            onValueChange={(value) => updateBlock(block.id, {
                                                microInteractions: { ...block.microInteractions, scroll: value === " " ? "" : value }
                                            })}
                                            disabled={!block.microInteractionsLocked}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value=" ">None</SelectItem>
                                                <SelectItem value="animate-fade-in">Fade In</SelectItem>
                                                <SelectItem value="animate-slide-up">Slide Up</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {!block.microInteractionsLocked && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Lock to customize interactions for this block
                                        </p>
                                    )}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </div>

            {/* Typography Section - SidebarMenu */}
            <div className="border-t pt-4">
                <SidebarMenu>
                    <Collapsible open={typographyOpen} onOpenChange={setTypographyOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <span>Typography</span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub className="px-4 py-2 space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                                        <Input
                                            id="fontSize"
                                            type="number"
                                            value={block.styles.fontSize || 16}
                                            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value) || 16)}
                                            className="h-9"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="color" className="text-xs">Text Color</Label>
                                        <input
                                            id="color"
                                            type="color"
                                            value={block.styles.color || '#000000'}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="h-9 w-full rounded-md border border-input"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fontWeight" className="text-xs">Font Weight</Label>
                                        <select
                                            id="fontWeight"
                                            value={block.styles.fontWeight || 400}
                                            onChange={(e) => handleStyleChange('fontWeight', parseInt(e.target.value))}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                        >
                                            <option value="300">Light (300)</option>
                                            <option value="400">Normal (400)</option>
                                            <option value="500">Medium (500)</option>
                                            <option value="600">Semibold (600)</option>
                                            <option value="700">Bold (700)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Alignment</Label>
                                        <div className="flex items-center gap-1 border rounded-md p-1">
                                            <Button
                                                variant={block.styles.textAlign === 'left' ? 'secondary' : 'ghost'}
                                                size="sm"
                                                className="flex-1 h-7 px-0"
                                                onClick={() => handleStyleChange('textAlign', 'left')}
                                            >
                                                <AlignLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant={block.styles.textAlign === 'center' ? 'secondary' : 'ghost'}
                                                size="sm"
                                                className="flex-1 h-7 px-0"
                                                onClick={() => handleStyleChange('textAlign', 'center')}
                                            >
                                                <AlignCenter className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant={block.styles.textAlign === 'right' ? 'secondary' : 'ghost'}
                                                size="sm"
                                                className="flex-1 h-7 px-0"
                                                onClick={() => handleStyleChange('textAlign', 'right')}
                                            >
                                                <AlignRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </div>


            {/* Spacing Section - SidebarMenu */}
            <div className="border-t pt-4">
                <SidebarMenu>
                    <Collapsible open={spacingOpen} onOpenChange={setSpacingOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <span>Spacing</span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub className="px-4 py-2 space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="margin" className="text-xs">Margin (px)</Label>
                                        <Input
                                            id="margin"
                                            type="number"
                                            value={block.styles.margin || 8}
                                            onChange={(e) => handleStyleChange('margin', parseInt(e.target.value) || 0)}
                                            className="h-8"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="padding" className="text-xs">Padding (px)</Label>
                                        <Input
                                            id="padding"
                                            type="number"
                                            value={block.styles.padding || 8}
                                            onChange={(e) => handleStyleChange('padding', parseInt(e.target.value) || 0)}
                                            className="h-8"
                                        />
                                    </div>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </div>

            {/* Background Section - SidebarMenu */}
            <div className="border-t pt-4">
                <SidebarMenu>
                    <Collapsible open={bgOpen} onOpenChange={setBgOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <span>Background</span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub className="px-4 py-2 space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="backgroundColor" className="text-xs">Background Color</Label>
                                        <input
                                            id="backgroundColor"
                                            type="color"
                                            value={block.styles.backgroundColor || '#ffffff'}
                                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                            className="h-9 w-full rounded-md border border-input"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Text color will auto-adjust for contrast
                                        </p>
                                    </div>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </div>


            {/* Border Section - SidebarMenu */}
            <div className="border-t pt-4">
                <SidebarMenu>
                    <Collapsible open={borderOpen} onOpenChange={setBorderOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <span>Border</span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub className="px-4 py-2 space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="borderWidth" className="text-xs">Border Width (px)</Label>
                                        <Input
                                            id="borderWidth"
                                            type="number"
                                            value={block.styles.borderWidth || 0}
                                            onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value) || 0)}
                                            className="h-8"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="borderColor" className="text-xs">Border Color</Label>
                                        <input
                                            id="borderColor"
                                            type="color"
                                            value={block.styles.borderColor || '#000000'}
                                            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                                            className="h-8 w-full rounded-md border border-input"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="borderRadius" className="text-xs">Border Radius (px)</Label>
                                        <Input
                                            id="borderRadius"
                                            type="number"
                                            value={block.styles.borderRadius || 0}
                                            onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value) || 0)}
                                            className="h-8"
                                        />
                                    </div>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </div>

            {/* Danger Zone */}
            <div className="border-t pt-4 mt-4 pb-8">
                <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                        deleteBlock(block.id)
                        onOpenChange(false)
                        toast.success('Block deleted')
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Block
                </Button>
            </div>
        </div >
    )

    return (
        <>
            <div onClick={() => onOpenChange(true)}>
                {children}
            </div>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : "w-[400px] sm:w-[540px]"} data-component-id={componentId}>
                    <SheetHeader>
                        <SheetTitle>Edit Block</SheetTitle>
                    </SheetHeader>
                    {editorContent}
                </SheetContent>
            </Sheet>
        </>
    )
}
