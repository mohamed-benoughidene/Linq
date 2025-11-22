# Linq Builder - Complete Implementation Plan (CORRECTED)

**Micro-Step Development Roadmap - Aligned with Chat History Agreements**

---

## Overview

This plan breaks down the Linq builder implementation into **50+ micro-steps** across **10 phases**. Each step is designed to take 5-15 minutes, change 1-3 files, and be independently testable and committable.

**CRITICAL ALIGNMENTS:**
- ✅ Dashboard page IS the builder (no separate routes)
- ✅ Popover on desktop + Sheet/Drawer on mobile
- ✅ Live preview for cheap CSS, Apply button for expensive operations
- ✅ Mobile editing fully supported (not desktop-only)
- ✅ Dual lock system: themeLocked + microInteractionsLocked

---

## Phase 0: Foundation Setup (Prerequisites)

### Step 0.1: Install Zustand
- **What**: Add Zustand for state management
- **Files**: `package.json`
- **Actions**:
  ```bash
  npm install zustand
  ```
- **Test**: Check `node_modules/zustand` exists
- **Commit**: `chore: install zustand for state management`

### Step 0.2: Add Toast Component
- **What**: Install shadcn toast component
- **Files**: `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx`, `src/components/ui/use-toast.ts`
- **Actions**:
  ```bash
  npx shadcn@latest add toast
  ```
- **Test**: Import toast in a test component, trigger a toast
- **Commit**: `feat: add toast component for user notifications`

### Step 0.3: Add Toaster to Root Layout
- **What**: Add `<Toaster />` to root layout so toasts work globally
- **Files**: `src/app/layout.tsx`
- **Actions**: Import and add `<Toaster />` before closing `</body>`
  ```typescript
  import { Toaster } from '@/components/ui/toaster'
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          {children}
          <Toaster />
        </body>
      </html>
    )
  }
  ```
- **Test**: Trigger a test toast from any page
- **Commit**: `feat: add toaster to root layout`

### Step 0.4: Install Sheet Component (for Mobile Drawer)
- **What**: Install shadcn sheet component for mobile block editing
- **Files**: `src/components/ui/sheet.tsx`
- **Actions**:
  ```bash
  npx shadcn@latest add sheet
  ```
- **Test**: Import Sheet components, verify no errors
- **Commit**: `feat: add sheet component for mobile editing`

### Step 0.5: Create TypeScript Types File
- **What**: Create central types file for builder
- **Files**: `src/types/builder.ts` (new)
- **Actions**: Define initial types:
  ```typescript
  export type BlockType = 'heading' | 'paragraph' | 'image' | 'link'
  
  export type BlockStyles = {
    fontSize?: number
    color?: string
    backgroundColor?: string
    fontFamily?: string
    fontWeight?: number
    margin?: number
    padding?: number
    borderWidth?: number
    borderColor?: string
    borderRadius?: number
  }
  
  export type BlockMicroInteractions = {
    hover?: string  // Tailwind class: 'hover:scale-105'
    click?: string  // Tailwind class: 'active:scale-95'
    scroll?: string // Tailwind class: 'animate-fade-in'
  }
  
  export type Block = {
    id: string
    type: BlockType
    position: number
    content: string
    styles: BlockStyles
    microInteractions: BlockMicroInteractions
    themeLocked: boolean
    microInteractionsLocked: boolean  // NEW: Second lock for micro-interactions
  }
  
  export type GlobalTheme = {
    name: string
    colors: {
      primary: string
      background: string
      text: string
      accent: string
    }
    typography: {
      font: string
      headingSize: number
      bodySize: number
    }
  }
  
  export type GlobalMicroInteractions = {
    hover: string
    click: string
    scroll: string
  }
  
  export type HistoryState = {
    past: Block[][]
    present: Block[]
    future: Block[][]
  }
  ```
- **Test**: Import types in another file, no TS errors
- **Commit**: `feat: create builder TypeScript types`

---

## Phase 1: Zustand Store Setup (State Foundation)

### Step 1.1: Create Basic Store Structure
- **What**: Create Zustand store with empty initial state
- **Files**: `src/store/builderStore.ts` (new)
- **Actions**:
  ```typescript
  import { create } from 'zustand'
  import { Block, GlobalTheme, GlobalMicroInteractions, HistoryState } from '@/types/builder'
  
  interface BuilderStore {
    blocks: Block[]
    selectedBlockId: string | null
    globalTheme: GlobalTheme
    globalMicroInteractions: GlobalMicroInteractions
    history: HistoryState
  }
  
  export const useBuilderStore = create<BuilderStore>((set) => ({
    blocks: [],
    selectedBlockId: null,
    globalTheme: {
      name: 'minimal',
      colors: {
        primary: '#000000',
        background: '#FFFFFF',
        text: '#000000',
        accent: '#666666'
      },
      typography: {
        font: 'Inter',
        headingSize: 32,
        bodySize: 16
      }
    },
    globalMicroInteractions: {
      hover: '',
      click: '',
      scroll: ''
    },
    history: {
      past: [],
      present: [],
      future: []
    }
  }))
  ```
- **Test**: 
  - Import store in a component
  - `console.log(useBuilderStore.getState().blocks)` should show empty array
- **Commit**: `feat: create basic zustand builder store`

### Step 1.2: Add Block Management Actions
- **What**: Add functions to add/update/delete blocks
- **Files**: `src/store/builderStore.ts`
- **Actions**: Add these methods to the store:
  ```typescript
  interface BuilderStore {
    // ... existing state
    addBlock: (block: Block) => void
    updateBlock: (id: string, updates: Partial<Block>) => void
    deleteBlock: (id: string) => void
    selectBlock: (id: string | null) => void
    duplicateBlock: (id: string) => void
  }
  
  export const useBuilderStore = create<BuilderStore>((set, get) => ({
    // ... existing state
    
    addBlock: (block: Block) => set((state) => ({
      blocks: [...state.blocks, block]
    })),
    
    updateBlock: (id: string, updates: Partial<Block>) => set((state) => ({
      blocks: state.blocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    })),
    
    deleteBlock: (id: string) => set((state) => ({
      blocks: state.blocks.filter(block => block.id !== id)
    })),
    
    selectBlock: (id: string | null) => set({ selectedBlockId: id }),
    
    duplicateBlock: (id: string) => set((state) => {
      const blockToDuplicate = state.blocks.find(b => b.id === id)
      if (!blockToDuplicate) return state
      
      const duplicatedBlock: Block = {
        ...blockToDuplicate,
        id: crypto.randomUUID(),
        position: Date.now(),
      }
      
      return {
        blocks: [...state.blocks, duplicatedBlock]
      }
    })
  }))
  ```
- **Test**: 
  ```typescript
  // In console or test component
  const { addBlock, blocks } = useBuilderStore.getState()
  addBlock({ 
    id: crypto.randomUUID(), 
    type: 'heading', 
    content: 'Test',
    position: Date.now(),
    styles: {},
    microInteractions: {},
    themeLocked: false,
    microInteractionsLocked: false
  })
  console.log(blocks) // Should show 1 block
  ```
- **Commit**: `feat: add block management actions to store`

### Step 1.3: Add localStorage Persistence
- **What**: Auto-save blocks to localStorage
- **Files**: `src/store/builderStore.ts`
- **Actions**: 
  - Wrap store with `persist` middleware
  ```typescript
  import { create } from 'zustand'
  import { persist } from 'zustand/middleware'
  
  export const useBuilderStore = create<BuilderStore>()(
    persist(
      (set, get) => ({
        // ... existing state and actions
      }),
      {
        name: 'linq-builder-storage',
        partialize: (state) => ({
          blocks: state.blocks,
          globalTheme: state.globalTheme,
          globalMicroInteractions: state.globalMicroInteractions
        })
      }
    )
  )
  ```
- **Test**: 
  - Add a block
  - Refresh page
  - Block should still be there (loaded from localStorage)
  - Check `localStorage.getItem('linq-builder-storage')` in devtools
- **Commit**: `feat: add localStorage persistence to builder store`

---

## Phase 2: Canvas & Basic Rendering (Visual Foundation)

### Step 2.1: Create Canvas Component
- **What**: Create empty canvas component
- **Files**: `src/components/builder/Canvas.tsx` (new)
- **Actions**:
  ```typescript
  'use client'
  
  export function Canvas() {
    return (
      <div className="canvas min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          {/* Blocks will render here */}
          <p className="text-muted-foreground">Canvas ready</p>
        </div>
      </div>
    )
  }
  ```
- **Test**: Import and render in dashboard page, should see "Canvas ready"
- **Commit**: `feat: create canvas component`

### Step 2.2: Integrate Canvas into Dashboard
- **What**: Replace placeholder content with Canvas in dashboard
- **Files**: `src/app/dashboard/page.tsx`
- **Actions**:
  - Import Canvas component
  - Add `<Canvas />` in the `<SidebarInset>` area
  ```typescript
  import { Canvas } from '@/components/builder/Canvas'
  
  export default function Page() {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            {/* existing header */}
          </header>
          <Canvas />
        </SidebarInset>
      </SidebarProvider>
    )
  }
  ```
- **Test**: Visit `/dashboard`, should see canvas with "Canvas ready" text
- **Commit**: `feat: integrate canvas into dashboard page`

### Step 2.3: Create BlockRenderer Component
- **What**: Component that renders different block types
- **Files**: `src/components/builder/BlockRenderer.tsx` (new)
- **Actions**:
  ```typescript
  'use client'
  
  import { Block } from '@/types/builder'
  import { cn } from '@/lib/utils'
  
  interface BlockRendererProps {
    block: Block
    onClick?: () => void
  }
  
  export function BlockRenderer({ block, onClick }: BlockRendererProps) {
    // HYBRID STYLING: Inline for custom values
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
  
    // HYBRID STYLING: Tailwind classes for micro-interactions
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
  ```
- **Test**: Create a test block manually and render it
- **Commit**: `feat: create block renderer component`

### Step 2.4: Render Blocks in Canvas
- **What**: Map over blocks from store and render them
- **Files**: `src/components/builder/Canvas.tsx`
- **Actions**:
  ```typescript
  'use client'
  
  import { useBuilderStore } from '@/store/builderStore'
  import { BlockRenderer } from './BlockRenderer'
  
  export function Canvas() {
    const { blocks, selectBlock } = useBuilderStore()
  
    return (
      <div className="canvas min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {blocks.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No blocks yet. Add one from the sidebar!
            </p>
          ) : (
            blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                onClick={() => selectBlock(block.id)}
              />
            ))
          )}
        </div>
      </div>
    )
  }
  ```
- **Test**: 
  - Manually add a block via console
  - Should render on canvas
- **Commit**: `feat: render blocks from store in canvas`

---

## Phase 3: Add Block Modal (Click-to-Add)

### Step 3.1: Create AddBlockModal Component
- **What**: Modal that shows block type options (for mobile-friendly UX)
- **Files**: `src/components/builder/AddBlockModal.tsx` (new)
- **Actions**:
  ```typescript
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
  ```
- **Test**: 
  - Render modal with `open={true}`
  - Should see 4 block type options
  - Click should trigger `onSelectBlock`
- **Commit**: `feat: create add block modal component`

### Step 3.2: Add "Add Blocks" Button to Sidebar
- **What**: Add collapsible section in sidebar to open modal
- **Files**: `src/components/ui/app-sidebar.tsx`
- **Actions**:
  - Add state for modal
  - Add "Add Blocks" collapsible section
  ```typescript
  'use client'
  
  import { useState } from 'react'
  import { AddBlockModal } from '@/components/builder/AddBlockModal'
  
  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [addBlockModalOpen, setAddBlockModalOpen] = useState(false)
  
    return (
      <>
        <Sidebar variant="inset" {...props}>
          <SidebarHeader>
            {/* existing header */}
          </SidebarHeader>
          <SidebarContent>
            {/* Add Blocks Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Add Blocks</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setAddBlockModalOpen(true)}>
                    📦 Static Blocks
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            {/* Keep existing sections */}
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </Sidebar>
        
        <AddBlockModal
          open={addBlockModalOpen}
          onOpenChange={setAddBlockModalOpen}
          onSelectBlock={(type) => {
            console.log('Selected block type:', type)
          }}
        />
      </>
    )
  }
  ```
- **Test**: 
  - Click "Static Blocks" in sidebar
  - Modal should open
  - Click a block type
  - Console should log the type
- **Commit**: `feat: add block selection button to sidebar`

### Step 3.3: Connect Modal to Store (Add Blocks)
- **What**: When user clicks block type, create and add block to store
- **Files**: `src/components/ui/app-sidebar.tsx`
- **Actions**:
  - Import store and toast
  - Create helper function
  - Connect handler
  ```typescript
  import { useBuilderStore } from '@/store/builderStore'
  import { useToast } from '@/hooks/use-toast'
  import { BlockType, Block } from '@/types/builder'
  
  function createDefaultBlock(type: BlockType): Block {
    return {
      id: crypto.randomUUID(),
      type,
      position: Date.now(),
      content: type === 'image' ? 'https://via.placeholder.com/400x300' : '',
      styles: {
        fontSize: type === 'heading' ? 32 : 16,
        color: '#000000',
        margin: 8,
        padding: 8,
      },
      microInteractions: {
        hover: '',
        click: '',
        scroll: '',
      },
      themeLocked: false,
      microInteractionsLocked: false,
    }
  }
  
  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [addBlockModalOpen, setAddBlockModalOpen] = useState(false)
    const { addBlock } = useBuilderStore()
    const { toast } = useToast()
  
    const handleSelectBlock = (type: BlockType) => {
      const newBlock = createDefaultBlock(type)
      addBlock(newBlock)
      toast({
        title: 'Block added',
        description: `${type} block added to canvas`,
      })
    }
  
    return (
      <>
        {/* ... sidebar */}
        <AddBlockModal
          open={addBlockModalOpen}
          onOpenChange={setAddBlockModalOpen}
          onSelectBlock={handleSelectBlock}
        />
      </>
    )
  }
  ```
- **Test**: 
  - Click "Static Blocks"
  - Click "Heading"
  - Toast should appear
  - Canvas should show new heading block
  - Refresh page - block should persist
- **Commit**: `feat: connect add block modal to store`

---

## Phase 4: Block Editing (Popover + Mobile Drawer)

### Step 4.1: Create Responsive BlockEditor Component
- **What**: Popover on desktop, Sheet/Drawer on mobile for editing
- **Files**: `src/components/builder/BlockEditor.tsx` (new)
- **Actions**:
  ```typescript
  'use client'
  
  import { useState, useEffect } from 'react'
  import { Block } from '@/types/builder'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
  
  interface BlockEditorProps {
    block: Block
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
  }
  
  export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
    const [isMobile, setIsMobile] = useState(false)
  
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])
  
    const editorContent = (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium capitalize">Edit {block.type}</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Editor controls will go here
        </p>
      </div>
    )
  
    // Mobile: Sheet/Drawer
    if (isMobile) {
      return (
        <>
          <div onClick={() => onOpenChange(true)}>
            {children}
          </div>
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
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-80">
          {editorContent}
        </PopoverContent>
      </Popover>
    )
  }
  ```
- **Test**: 
  - Desktop: Click block, popover appears on right
  - Mobile (resize < 768px): Click block, drawer slides up from bottom
- **Commit**: `feat: create responsive block editor (popover + drawer)`

### Step 4.2: Integrate BlockEditor with Canvas
- **What**: Wrap rendered blocks with BlockEditor
- **Files**: `src/components/builder/Canvas.tsx`
- **Actions**:
  ```typescript
  import { BlockEditor } from './BlockEditor'
  
  export function Canvas() {
    const { blocks, selectedBlockId, selectBlock } = useBuilderStore()
  
    return (
      <div className="canvas min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {blocks.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No blocks yet. Add one from the sidebar!
            </p>
          ) : (
            blocks.map((block) => (
              <BlockEditor
                key={block.id}
                block={block}
                open={selectedBlockId === block.id}
                onOpenChange={(open) => selectBlock(open ? block.id : null)}
              >
                <div>
                  <BlockRenderer block={block} />
                </div>
              </BlockEditor>
            ))
          )}
        </div>
      </div>
    )
  }
  ```
- **Test**: 
  - Desktop: Click block, popover opens
  - Mobile: Click block, drawer slides up
  - Click outside, editor closes
- **Commit**: `feat: integrate responsive block editor with canvas`

---

**For the remaining phases (5-10), see Part 2 of this plan.**

**Next file: `complete-implementation-plan-part2-corrected.md`**