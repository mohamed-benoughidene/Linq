'use client'

import { useState, useEffect } from 'react'
import { Block } from '@/types/builder'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useBuilderStore } from '@/store/builderStore'
import { useDebounceCallback } from 'usehooks-ts'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Lock, Unlock } from 'lucide-react'
import { themes } from '@/lib/themes'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BlockEditorProps {
    block: Block
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [content, setContent] = useState(block.content)
    const { updateBlock, applyBlockTheme } = useBuilderStore()
    const [selectedTheme, setSelectedTheme] = useState<string>('minimal')

    // Sync local state ONLY when switching to a different block
    // NOT when content updates (to avoid bouncing while typing)
    useEffect(() => {
        setContent(block.content)
    }, [block.id])  // Only when block ID changes, not content!

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Debounced update: Store updates 500ms after user stops typing
    const debouncedUpdate = useDebounceCallback((newContent: string) => {
        updateBlock(block.id, { content: newContent })
    }, 500)

    const handleContentChange = (newContent: string) => {
        setContent(newContent)  // Local state: INSTANT (user sees immediately)
        debouncedUpdate(newContent)  // Store: DELAYED 500ms (performance)
    }

    const handleStyleChange = (property: keyof Block['styles'], value: string | number) => {
        updateBlock(block.id, {
            styles: { ...block.styles, [property]: value }
        })
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
        <div className="space-y-4 h-full overflow-y-auto pr-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">Edit {block.type}</h4>
            </div>

            {/* Content Section */}
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

            {/* Theme Section */}
            <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {block.themeLocked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Unlock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Label className="text-sm font-medium">Theme Lock</Label>
                        <Switch
                            checked={block.themeLocked}
                            onCheckedChange={toggleThemeLock}
                        />
                    </div>

                    {!block.themeLocked && (
                        <p className="text-xs text-muted-foreground">
                            Lock to prevent global theme changes from affecting this block
                        </p>
                    )}

                    {block.themeLocked && (
                        <div className="bg-muted/50 p-3 rounded-md space-y-2 mt-2">
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
                </div>
            </div>

            {/* Micro-Interactions Section */}
            <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Micro-Interactions Lock</Label>
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
            </div>

            {/* Typography Section */}
            <div className="space-y-3 pt-4 border-t">
                <h5 className="text-sm font-medium">Typography</h5>

                <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <input
                        id="fontSize"
                        type="number"
                        value={block.styles.fontSize || 16}
                        onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value) || 16)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="color">Text Color</Label>
                    <input
                        id="color"
                        type="color"
                        value={block.styles.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="h-9 w-full rounded-md border border-input"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fontWeight">Font Weight</Label>
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
            </div>

            {/* Spacing Section */}
            <div className="space-y-3 pt-4 border-t">
                <h5 className="text-sm font-medium">Spacing</h5>

                <div className="space-y-2">
                    <Label htmlFor="margin">Margin (px)</Label>
                    <input
                        id="margin"
                        type="number"
                        value={block.styles.margin || 8}
                        onChange={(e) => handleStyleChange('margin', parseInt(e.target.value) || 0)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="padding">Padding (px)</Label>
                    <input
                        id="padding"
                        type="number"
                        value={block.styles.padding || 8}
                        onChange={(e) => handleStyleChange('padding', parseInt(e.target.value) || 0)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Background Section */}
            <div className="space-y-3 pt-4 border-t">
                <h5 className="text-sm font-medium">Background</h5>

                <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <input
                        id="backgroundColor"
                        type="color"
                        value={block.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="h-9 w-full rounded-md border border-input"
                    />
                </div>
            </div>

            {/* Border Section */}
            <div className="space-y-3 pt-4 border-t">
                <h5 className="text-sm font-medium">Border</h5>

                <div className="space-y-2">
                    <Label htmlFor="borderWidth">Border Width (px)</Label>
                    <input
                        id="borderWidth"
                        type="number"
                        value={block.styles.borderWidth || 0}
                        onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value) || 0)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="borderColor">Border Color</Label>
                    <input
                        id="borderColor"
                        type="color"
                        value={block.styles.borderColor || '#000000'}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        className="h-9 w-full rounded-md border border-input"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="borderRadius">Border Radius (px)</Label>
                    <input
                        id="borderRadius"
                        type="number"
                        value={block.styles.borderRadius || 0}
                        onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value) || 0)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    />
                </div>
            </div>
        </div>
    )

    return (
        <>
            <div onClick={() => onOpenChange(true)}>
                {children}
            </div>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : "w-[400px] sm:w-[540px]"}>
                    <SheetHeader>
                        <SheetTitle>Edit Block</SheetTitle>
                    </SheetHeader>
                    {editorContent}
                </SheetContent>
            </Sheet>
        </>
    )
}
