# Linq Builder - Complete Implementation Plan Part 2 (CORRECTED)

**Detailed Steps for Phases 5-10 - Aligned with Chat History Agreements**

This is Part 2 of the corrected implementation plan.

For Phases 0-4, see: `complete-implementation-plan-corrected.md`

---

## Phase 5: Content Editing (Debounced for Performance)

### Step 5.1: Add Debounced Content Input to BlockEditor
- **What**: Add textarea/input with 500ms debounce to prevent constant re-renders while typing
- **Files**: `src/components/builder/BlockEditor.tsx`
- **Actions**:
  - First install usehooks-ts:
  ```bash
  npm install usehooks-ts
  ```
  - Then update BlockEditor:
  ```typescript
  'use client'
  
  import { useState } from 'react'
  import { Block } from '@/types/builder'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
  import { Textarea } from '@/components/ui/textarea'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { useBuilderStore } from '@/store/builderStore'
  import { useDebounceCallback } from 'usehooks-ts'
  
  export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
    const { updateBlock } = useBuilderStore()
    const [content, setContent] = useState(block.content)
    const [isMobile, setIsMobile] = useState(false)
  
    // DEBOUNCED UPDATE: Prevents constant re-renders while typing
    // User sees immediate feedback in local state,
    // but store updates only after 500ms pause
    const debouncedUpdate = useDebounceCallback((newContent: string) => {
      updateBlock(block.id, { content: newContent })
    }, 500)
  
    const handleContentChange = (newContent: string) => {
      setContent(newContent) // Update local state immediately (smooth UX)
      debouncedUpdate(newContent) // Update store with delay (performance)
    }
  
    const isTextBlock = block.type === 'heading' || block.type === 'paragraph'
    const isImageBlock = block.type === 'image'
    const isLinkBlock = block.type === 'link'
  
    const editorContent = (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium capitalize">Edit {block.type}</h4>
        </div>
  
        {/* Content Section */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          {isTextBlock && (
            <Textarea
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={`Enter ${block.type} text...`}
              className="min-h-[100px]"
            />
          )}
          {isImageBlock && (
            <Input
              id="content"
              type="url"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter image URL..."
            />
          )}
          {isLinkBlock && (
            <Input
              id="content"
              type="url"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter link URL..."
            />
          )}
        </div>
      </div>
    )
  
    // Mobile: Sheet/Drawer
    if (isMobile) {
      return (
        <>
          <div onClick={() => onOpenChange(true)}>{children}</div>
          <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Edit Block</SheetTitle>
              </SheetHeader>
              {editorContent}
            </SheetContent>
          </Sheet>
        </>
      )
    }
  
    // Desktop: Popover
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-80">
          {editorContent}
        </PopoverContent>
      </Popover>
    )
  }
  ```
- **Test**: 
  - Click a heading block
  - Type quickly in textarea
  - Content should update smoothly without lag
  - Check console - store updates should be throttled (500ms)
  - Content should persist after debounce delay
- **Commit**: `feat: add debounced content editing (500ms for performance)`

---

## Phase 6: Style Editing (LIVE Preview for Cheap CSS)

### Step 6.1: Add Typography Controls with LIVE Preview
- **What**: Font size, color, font family controls with INSTANT live preview (no apply button needed)
- **Files**: `src/components/builder/BlockEditor.tsx`
- **Actions**:
  ```typescript
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  
  export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
    const { updateBlock } = useBuilderStore()
  
    // LIVE UPDATE: No debounce for CSS changes (cheap to compute)
    const handleStyleChange = (property: keyof Block['styles'], value: string | number) => {
      updateBlock(block.id, {
        styles: {
          ...block.styles,
          [property]: value
        }
      })
    }
  
    const editorContent = (
      <div className="space-y-4">
        {/* Existing content section */}
        
        {/* Typography Section - LIVE PREVIEW */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="typography">
            <AccordionTrigger className="text-sm">Typography</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {/* Font Family */}
                <div>
                  <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                  <Select
                    value={block.styles.fontFamily || 'Inter'}
                    onValueChange={(value) => handleStyleChange('fontFamily', value)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
  
                {/* Font Size - LIVE PREVIEW */}
                <div>
                  <Label htmlFor="fontSize" className="text-xs">Font Size (px)</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    min="8"
                    max="120"
                    value={block.styles.fontSize || 16}
                    onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                    className="h-8 mt-1"
                  />
                </div>
  
                {/* Font Weight */}
                <div>
                  <Label htmlFor="fontWeight" className="text-xs">Font Weight</Label>
                  <Select
                    value={String(block.styles.fontWeight || 400)}
                    onValueChange={(value) => handleStyleChange('fontWeight', parseInt(value))}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light (300)</SelectItem>
                      <SelectItem value="400">Regular (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                      <SelectItem value="600">Semibold (600)</SelectItem>
                      <SelectItem value="700">Bold (700)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
  
                {/* Text Color - LIVE PREVIEW */}
                <div>
                  <Label htmlFor="color" className="text-xs">Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="color"
                      type="color"
                      value={block.styles.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="h-8 w-12 p-1"
                    />
                    <Input
                      type="text"
                      value={block.styles.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="h-8"
                      placeholder="#000000"
                    />
                  </div>
                </div>
  
                {/* Background Color - LIVE PREVIEW */}
                <div>
                  <Label htmlFor="backgroundColor" className="text-xs">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={block.styles.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="h-8 w-12 p-1"
                    />
                    <Input
                      type="text"
                      value={block.styles.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="h-8"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  
    // ... rest of component (mobile/desktop rendering)
  }
  ```
- **Test**: 
  - Click a block
  - Change font size - should update INSTANTLY on canvas
  - Change color - should update INSTANTLY on canvas
  - No delay, no apply button needed
  - All changes persist immediately
- **Commit**: `feat: add live preview typography controls`

### Step 6.2: Add Spacing Controls with LIVE Preview
- **What**: Margin and padding with instant live preview
- **Files**: `src/components/builder/BlockEditor.tsx`
- **Actions**:
  ```typescript
  <AccordionItem value="spacing">
    <AccordionTrigger className="text-sm">Spacing</AccordionTrigger>
    <AccordionContent>
      <div className="space-y-3">
        {/* Margin - LIVE PREVIEW */}
        <div>
          <Label htmlFor="margin" className="text-xs">Margin (px)</Label>
          <Input
            id="margin"
            type="number"
            min="0"
            max="200"
            value={block.styles.margin || 0}
            onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
            className="h-8 mt-1"
          />
        </div>
  
        {/* Padding - LIVE PREVIEW */}
        <div>
          <Label htmlFor="padding" className="text-xs">Padding (px)</Label>
          <Input
            id="padding"
            type="number"
            min="0"
            max="200"
            value={block.styles.padding || 0}
            onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
            className="h-8 mt-1"
          />
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
  ```
- **Test**: 
  - Adjust margin/padding
  - Block spacing should update INSTANTLY
  - No lag, no apply button
- **Commit**: `feat: add live preview spacing controls`

### Step 6.3: Add Border Controls with LIVE Preview
- **What**: Border width, color, radius with instant preview
- **Files**: `src/components/builder/BlockEditor.tsx`
- **Actions**:
  ```typescript
  <AccordionItem value="border">
    <AccordionTrigger className="text-sm">Border</AccordionTrigger>
    <AccordionContent>
      <div className="space-y-3">
        {/* Border Width - LIVE PREVIEW */}
        <div>
          <Label htmlFor="borderWidth" className="text-xs">Border Width (px)</Label>
          <Input
            id="borderWidth"
            type="number"
            min="0"
            max="20"
            value={block.styles.borderWidth || 0}
            onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value))}
            className="h-8 mt-1"
          />
        </div>
  
        {/* Border Color - LIVE PREVIEW */}
        <div>
          <Label htmlFor="borderColor" className="text-xs">Border Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="borderColor"
              type="color"
              value={block.styles.borderColor || '#000000'}
              onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              className="h-8 w-12 p-1"
            />
            <Input
              type="text"
              value={block.styles.borderColor || '#000000'}
              onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              className="h-8"
              placeholder="#000000"
            />
          </div>
        </div>
  
        {/* Border Radius - LIVE PREVIEW */}
        <div>
          <Label htmlFor="borderRadius" className="text-xs">Border Radius (px)</Label>
          <Input
            id="borderRadius"
            type="number"
            min="0"
            max="100"
            value={block.styles.borderRadius || 0}
            onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
            className="h-8 mt-1"
          />
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
  ```
- **Test**: 
  - Add border (width > 0)
  - Change border properties
  - Should update INSTANTLY
- **Commit**: `feat: add live preview border controls`

### Step 6.4: Add Delete & Duplicate Actions
- **What**: Buttons to delete or duplicate current block
- **Files**: `src/components/builder/BlockEditor.tsx`
- **Actions**:
  ```typescript
  import { Trash2, Copy } from 'lucide-react'
  import { Button } from '@/components/ui/button'
  import { useToast } from '@/hooks/use-toast'
  
  export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
    const { updateBlock, deleteBlock, duplicateBlock } = useBuilderStore()
    const { toast } = useToast()
  
    const handleDelete = () => {
      deleteBlock(block.id)
      onOpenChange(false)
      toast({
        title: 'Block deleted',
        description: 'Block removed from canvas',
      })
    }
  
    const handleDuplicate = () => {
      duplicateBlock(block.id)
      onOpenChange(false)
      toast({
        title: 'Block duplicated',
        description: 'A copy has been added to canvas',
      })
    }
  
    const editorContent = (
      <div className="space-y-4">
        {/* ... existing sections ... */}
        
        {/* Actions at bottom */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    )
  
    // ... rest of component
  }
  ```
- **Test**: 
  - Click delete - block disappears, toast shown
  - Click duplicate - new block appears
- **Commit**: `feat: add delete and duplicate actions`

---

## Phase 7: Themes System (Global + Per-Block with Locks + APPLY Button)

### Step 7.1: Create Theme Definitions
- **What**: Define predefined themes
- **Files**: `src/lib/themes.ts` (new)
- **Actions**:
  ```typescript
  import { GlobalTheme } from '@/types/builder'
  
  export const themes: Record<string, GlobalTheme> = {
    minimal: {
      name: 'Minimal',
      colors: {
        primary: '#000000',
        background: '#FFFFFF',
        text: '#000000',
        accent: '#666666',
      },
      typography: {
        font: 'Inter',
        headingSize: 32,
        bodySize: 16,
      },
    },
    bold: {
      name: 'Bold',
      colors: {
        primary: '#FF0000',
        background: '#FFFFFF',
        text: '#000000',
        accent: '#0000FF',
      },
      typography: {
        font: 'Arial',
        headingSize: 48,
        bodySize: 18,
      },
    },
    dark: {
      name: 'Dark',
      colors: {
        primary: '#FFFFFF',
        background: '#111111',
        text: '#FFFFFF',
        accent: '#888888',
      },
      typography: {
        font: 'Helvetica',
        headingSize: 36,
        bodySize: 16,
      },
    },
    pastel: {
      name: 'Pastel',
      colors: {
        primary: '#FFB6C1',
        background: '#FFF8F0',
        text: '#4A4A4A',
        accent: '#B4E7FF',
      },
      typography: {
        font: 'Georgia',
        headingSize: 28,
        bodySize: 16,
      },
    },
  }
  ```
- **Test**: Import themes, verify structure
- **Commit**: `feat: create predefined theme definitions`

### Step 7.2: Add Theme Application Logic to Store
- **What**: Functions to apply themes globally (sidebar) and per-block (popover)
- **Files**: `src/store/builderStore.ts`
- **Actions**:
  ```typescript
  interface BuilderStore {
    // ... existing state
    applyGlobalTheme: (theme: GlobalTheme) => void
    applyBlockTheme: (id: string, theme: GlobalTheme) => void
  }
  
  export const useBuilderStore = create<BuilderStore>()(
    persist(
      (set) => ({
        // ... existing state
        
        // GLOBAL THEME: Apply to all UNLOCKED blocks
        applyGlobalTheme: (theme: GlobalTheme) => set((state) => {
          const updatedBlocks = state.blocks.map(block => {
            // SKIP LOCKED BLOCKS
            if (block.themeLocked) return block
            
            return {
              ...block,
              styles: {
                ...block.styles,
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
                fontFamily: theme.typography.font,
                fontSize: block.type === 'heading' 
                  ? theme.typography.headingSize 
                  : theme.typography.bodySize,
              }
            }
          })
          
          return {
            blocks: updatedBlocks,
            globalTheme: theme
          }
        }),
        
        // BLOCK-LEVEL THEME: Apply to single block only
        applyBlockTheme: (id: string, theme: GlobalTheme) => set((state) => ({
          blocks: state.blocks.map(block => {
            if (block.id !== id) return block
            
            return {
              ...block,
              styles: {
                ...block.styles,
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
                fontFamily: theme.typography.font,
                fontSize: block.type === 'heading'
                  ? theme.typography.headingSize
                  : theme.typography.bodySize,
              }
            }
          })
        })),
      }),
      // ... persist config
    )
  )
  ```
- **Test**: 
  - Call `applyGlobalTheme(themes.dark)`
  - Unlocked blocks change, locked blocks stay same
- **Commit**: `feat: add theme application logic with lock support`

### Step 7.3: Create ThemesSection Component with APPLY Button
- **What**: Sidebar section with theme cards + apply button (expensive operation)
- **Files**: `src/components/sidebar/ThemesSection.tsx` (new)
- **Actions**:
  ```typescript
  'use client'
  
  import { useState } from 'react'
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
  import { SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar'
  import { Button } from '@/components/ui/button'
  import { Palette } from 'lucide-react'
  import { themes } from '@/lib/themes'
  import { useBuilderStore } from '@/store/builderStore'
  import { useToast } from '@/hooks/use-toast'
  
  export function ThemesSection() {
    const { applyGlobalTheme } = useBuilderStore()
    const { toast } = useToast()
    const [selectedTheme, setSelectedTheme] = useState<string>('minimal')
  
    const handleApplyTheme = () => {
      applyGlobalTheme(themes[selectedTheme])
      toast({
        title: 'Theme applied',
        description: `${themes[selectedTheme].name} theme applied to all unlocked blocks`,
      })
    }
  
    return (
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Palette className="mr-2 h-4 w-4" />
            Themes
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="px-4 py-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`theme-card border rounded p-3 hover:border-primary transition-colors ${
                    selectedTheme === key ? 'border-primary bg-accent' : ''
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div 
                      className="h-3 w-3 rounded-full border" 
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="h-3 w-3 rounded-full border" 
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    <div 
                      className="h-3 w-3 rounded-full border" 
                      style={{ backgroundColor: theme.colors.text }}
                    />
                  </div>
                  <span className="text-xs font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
            
            {/* APPLY BUTTON: Expensive operation requires user confirmation */}
            <Button 
              onClick={handleApplyTheme}
              className="w-full"
              size="sm"
            >
              Apply Theme
            </Button>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }
  ```
- **Test**: 
  - Click theme cards (selection updates)
  - Click "Apply Theme" button
  - All unlocked blocks update
  - Toast appears
- **Commit**: `feat: create themes section with apply button`

### Step 7.4: Add Theme Lock Toggle to BlockEditor
- **What**: Switch to lock/unlock block from global theme changes
- **Files**: `src/components/builder/BlockEditor.tsx`
- **Actions**:
  ```typescript
  import { Switch } from '@/components/ui/switch'
  import { Lock, Unlock } from 'lucide-react'
  import { themes } from '@/lib/themes'
  
  export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
    const { updateBlock, applyBlockTheme } = useBuilderStore()
    const { toast } = useToast()
    const [selectedTheme, setSelectedTheme] = useState<string>('minimal')
  
    const toggleThemeLock = () => {
      updateBlock(block.id, { themeLocked: !block.themeLocked })
    }
  
    const handleApplyBlockTheme = () => {
      applyBlockTheme(block.id, themes[selectedTheme])
      toast({
        title: 'Theme applied',
        description: 'Theme applied to this block only',
      })
    }
  
    const editorContent = (
      <div className="space-y-4">
        {/* ... existing sections ... */}
  
        {/* Theme Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {block.themeLocked ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Unlock className="h-4 w-4 text-muted-foreground" />
              )}
              <Label htmlFor="themeLock" className="text-sm font-medium">
                Theme Lock
              </Label>
            </div>
            <Switch
              id="themeLock"
              checked={block.themeLocked}
              onCheckedChange={toggleThemeLock}
            />
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {block.themeLocked
              ? "🔒 This block won't change when global theme is applied"
              : "🔓 This block will update with global theme changes"
            }
          </p>
          
          {/* Quick Theme Apply for This Block */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Quick Theme</Label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(themes).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`text-xs px-2 py-1 rounded border ${
                    selectedTheme === key ? 'bg-accent border-primary' : ''
                  }`}
                >
                  {themes[key].name}
                </button>
              ))}
            </div>
            <Button 
              onClick={handleApplyBlockTheme}
              size="sm"
              variant="outline"
              className="w-full"
            >
              Apply to This Block
            </Button>
          </div>
        </div>
  
        {/* ... existing actions ... */}
      </div>
    )
  
    // ... rest of component
  }
  ```
- **Test**: 
  - Lock a block
  - Apply global theme from sidebar
  - Locked block should NOT change
  - Apply theme from block editor
  - That block SHOULD change
- **Commit**: `feat: add theme lock and per-block theme application`

### Step 7.5: Integrate ThemesSection into Sidebar
- **What**: Add ThemesSection to app sidebar
- **Files**: `src/components/ui/app-sidebar.tsx`
- **Actions**:
  ```typescript
  import { ThemesSection } from '@/components/sidebar/ThemesSection'
  
  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          {/* existing header */}
        </SidebarHeader>
        <SidebarContent>
          {/* Existing Add Blocks section */}
          
          {/* Add Customization Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Customization</SidebarGroupLabel>
            <SidebarMenu>
              <ThemesSection />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    )
  }
  ```
- **Test**: 
  - See themes section in sidebar
  - Select theme + click Apply
  - Blocks update
- **Commit**: `feat: integrate themes section into sidebar`

---

## Phase 8: Micro-Interactions System (Global + Per-Block with Locks + APPLY Button)

### Step 8.1: Add Micro-Interactions Logic to Store
- **What**: Functions to apply micro-interactions globally and per-block (same pattern as themes)
- **Files**: `src/store/builderStore.ts`
- **Actions**:
  ```typescript
  interface BuilderStore {
    // ... existing state
    applyGlobalMicroInteractions: (interactions: GlobalMicroInteractions) => void
    applyBlockMicroInteractions: (id: string, interactions: Partial<BlockMicroInteractions>) => void
  }
  
  export const useBuilderStore = create<BuilderStore>()(
    persist(
      (set) => ({
        // ... existing state
        
        // GLOBAL MICRO-INTERACTIONS: Apply to all UNLOCKED blocks
        applyGlobalMicroInteractions: (interactions: GlobalMicroInteractions) => set((state) => {
          const updatedBlocks = state.blocks.map(block => {
            // SKIP LOCKED BLOCKS
            if (block.microInteractionsLocked) return block
            
            return {
              ...block,
              microInteractions: {
                hover: interactions.hover,
                click: interactions.click,
                scroll: interactions.scroll,
              }
            }
          })
          
          return {
            blocks: updatedBlocks,
            globalMicroInteractions: interactions
          }
        }),
        
        // BLOCK-LEVEL MICRO-INTERACTIONS: Apply to single block
        applyBlockMicroInteractions: (id: string, interactions: Partial<BlockMicroInteractions>) => set((state) => ({
          blocks: state.blocks.map(block => {
            if (block.id !== id) return block
            
            return {
              ...block,
              microInteractions: {
                ...block.microInteractions,
                ...interactions
              }
            }
          })
        })),
      }),
      // ... persist config
    )
  )
  ```
- **Test**: 
  - Call `applyGlobalMicroInteractions({ hover: 'hover:scale-105', click: '', scroll: '' })`
  - Unlocked blocks get hover effect
- **Commit**: `feat: add micro-interactions logic with lock support`

### Step 8.2: Create MicroInteractionsSection Component with APPLY Button
- **What**: Sidebar section for global micro-interactions
- **Files**: `src/components/sidebar/MicroInteractionsSection.tsx` (new)
- **Actions**:
  ```typescript
  'use client'
  
  import { useState } from 'react'
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
  import { SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { Button } from '@/components/ui/button'
  import { Label } from '@/components/ui/label'
  import { Sparkles } from 'lucide-react'
  import { useBuilderStore } from '@/store/builderStore'
  import { useToast } from '@/hooks/use-toast'
  
  export function MicroInteractionsSection() {
    const { applyGlobalMicroInteractions } = useBuilderStore()
    const { toast } = useToast()
    const [hover, setHover] = useState('')
    const [click, setClick] = useState('')
    const [scroll, setScroll] = useState('')
  
    const handleApply = () => {
      applyGlobalMicroInteractions({ hover, click, scroll })
      toast({
        title: 'Micro-interactions applied',
        description: 'Applied to all unlocked blocks',
      })
    }
  
    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Sparkles className="mr-2 h-4 w-4" />
            Micro Interactions
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="px-4 py-2 space-y-3">
            {/* Hover Effect */}
            <div>
              <Label className="text-xs">Hover Effect</Label>
              <Select value={hover} onValueChange={setHover}>
                <SelectTrigger className="h-8 mt-1">
                  <SelectValue placeholder="Select effect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="hover:scale-105">Scale Up</SelectItem>
                  <SelectItem value="hover:scale-95">Scale Down</SelectItem>
                  <SelectItem value="hover:opacity-80">Fade</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* Click Animation */}
            <div>
              <Label className="text-xs">Click Animation</Label>
              <Select value={click} onValueChange={setClick}>
                <SelectTrigger className="h-8 mt-1">
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="active:scale-95">Shrink</SelectItem>
                  <SelectItem value="active:scale-105">Grow</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* Scroll Animation */}
            <div>
              <Label className="text-xs">Scroll Animation</Label>
              <Select value={scroll} onValueChange={setScroll}>
                <SelectTrigger className="h-8 mt-1">
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="animate-fade-in">Fade In</SelectItem>
                  <SelectItem value="animate-slide-up">Slide Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* APPLY BUTTON: Expensive operation */}
            <Button onClick={handleApply} className="w-full" size="sm">
              Apply Interactions
            </Button>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }
  ```
- **Test**: 
  - Select interactions
  - Click Apply
  - Unlocked blocks get interactions
- **Commit**: `feat: create micro-interactions section with apply button`

### Step 8.3: Add Micro-Interactions Lock to BlockEditor
- **What**: Lock toggle + per-block micro-interactions
- **Files**: `src/components/builder/BlockEditor.tsx`
- **Actions**:
  ```typescript
  const toggleMicroInteractionsLock = () => {
    updateBlock(block.id, { microInteractionsLocked: !block.microInteractionsLocked })
  }
  
  const editorContent = (
    <div className="space-y-4">
      {/* ... existing sections ... */}
  
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
          <Label className="text-xs">Hover</Label>
          <Select
            value={block.microInteractions.hover || ''}
            onValueChange={(value) => updateBlock(block.id, {
              microInteractions: { ...block.microInteractions, hover: value }
            })}
            disabled={!block.microInteractionsLocked}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="hover:scale-105">Scale Up</SelectItem>
              <SelectItem value="hover:opacity-80">Fade</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Similar for click and scroll */}
        </div>
        
        {!block.microInteractionsLocked && (
          <p className="text-xs text-muted-foreground mt-2">
            Lock to customize interactions for this block
          </p>
        )}
      </div>
  
      {/* ... rest ... */}
    </div>
  )
  ```
- **Test**: 
  - Lock interactions for block
  - Apply global interactions
  - Locked block unchanged
- **Commit**: `feat: add micro-interactions lock to block editor`

### Step 8.4: Integrate MicroInteractionsSection into Sidebar
- **What**: Add to sidebar
- **Files**: `src/components/ui/app-sidebar.tsx`
- **Actions**:
  ```typescript
  import { MicroInteractionsSection } from '@/components/sidebar/MicroInteractionsSection'
  
  <SidebarGroup>
    <SidebarGroupLabel>Customization</SidebarGroupLabel>
    <SidebarMenu>
      <ThemesSection />
      <MicroInteractionsSection />
    </SidebarMenu>
  </SidebarGroup>
  ```
- **Test**: See in sidebar, apply interactions
- **Commit**: `feat: integrate micro-interactions into sidebar`

---

## Phases 9-10 (Database, Undo/Redo, Documentation)

These phases remain largely the same as the original plan, with these key corrections:

**Phase 9**: Undo/Redo - Same as original  
**Phase 10**: Documentation - Update to reflect:
- Mobile editing supported (Sheet/Drawer)
- Live preview vs Apply button distinction
- Dual lock system (theme + microInteractions)
- Dashboard IS the builder

---

**Total: 50+ steps with all chat agreements properly implemented**