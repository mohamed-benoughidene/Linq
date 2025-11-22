# Migration Plan: Correct Implementation Alignment

**This guide helps migrate from the old plan to the corrected implementation plan**

---

## Overview

Your agent has started implementing the old plan. This migration guide corrects the implementation to match the chat history agreements.

**Critical Differences:**
1. ❌ Old: Desktop-only Popover
   ✅ New: Responsive (Popover on desktop, Sheet/Drawer on mobile)

2. ❌ Old: All changes have live preview
   ✅ New: CSS changes live, Themes/Interactions need Apply button

3. ❌ Old: Single `themeLocked` property
   ✅ New: Dual locks (`themeLocked` + `microInteractionsLocked`)

4. ❌ Old: Content editing without emphasis on debouncing
   ✅ New: 500ms debounce with clear performance reasoning

---

## Migration Steps

### Step M1: Verify Current Implementation State

**What**: Check which steps from old plan have been completed
**Actions**:
- Review existing code in repository
- Identify completed phases (0-4 likely done)
- Check if Phase 5+ started
- List files that need modification

**Test**:
```bash
# Check which files exist
ls src/components/builder/
ls src/components/sidebar/
ls src/store/
ls src/types/

# Check git history
git log --oneline --decorate
```

**Commit**: `docs: audit current implementation status`

---

### Step M2: Update TypeScript Types (Add Second Lock)

**What**: Add `microInteractionsLocked` property to Block type
**Files**: `src/types/builder.ts`

**Current Code (OLD):**
```typescript
export type Block = {
  id: string
  type: BlockType
  position: number
  content: string
  styles: BlockStyles
  microInteractions: BlockMicroInteractions
  themeLocked: boolean
  // ❌ Missing: microInteractionsLocked
}
```

**Updated Code (NEW):**
```typescript
export type Block = {
  id: string
  type: BlockType
  position: number
  content: string
  styles: BlockStyles
  microInteractions: BlockMicroInteractions
  themeLocked: boolean
  microInteractionsLocked: boolean  // ✅ ADDED: Second lock
}

// ✅ ALSO ADD: Global micro-interactions type
export type GlobalMicroInteractions = {
  hover: string
  click: string
  scroll: string
}
```

**Test**:
- Import types in another file
- No TypeScript errors
- `Block` type now has both lock properties

**Commit**: `fix: add microInteractionsLocked to Block type`

---

### Step M3: Update Store State (Add GlobalMicroInteractions)

**What**: Add global micro-interactions state to store
**Files**: `src/store/builderStore.ts`

**Current Code (OLD):**
```typescript
interface BuilderStore {
  blocks: Block[]
  selectedBlockId: string | null
  globalTheme: GlobalTheme
  // ❌ Missing: globalMicroInteractions
}
```

**Updated Code (NEW):**
```typescript
import { GlobalMicroInteractions } from '@/types/builder'

interface BuilderStore {
  blocks: Block[]
  selectedBlockId: string | null
  globalTheme: GlobalTheme
  globalMicroInteractions: GlobalMicroInteractions  // ✅ ADDED
}

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set, get) => ({
      // ... existing state
      globalMicroInteractions: {
        hover: '',
        click: '',
        scroll: ''
      },  // ✅ ADDED initial state
      // ... rest of state
    }),
    {
      name: 'linq-builder-storage',
      partialize: (state) => ({
        blocks: state.blocks,
        globalTheme: state.globalTheme,
        globalMicroInteractions: state.globalMicroInteractions  // ✅ ADDED to persist
      })
    }
  )
)
```

**Test**:
- `console.log(useBuilderStore.getState().globalMicroInteractions)`
- Should output: `{ hover: '', click: '', scroll: '' }`

**Commit**: `fix: add globalMicroInteractions to store state`

---

### Step M4: Update createDefaultBlock Helper (Add Second Lock)

**What**: Add `microInteractionsLocked: false` to default block creation
**Files**: `src/components/ui/app-sidebar.tsx` (or wherever this helper is)

**Current Code (OLD):**
```typescript
function createDefaultBlock(type: BlockType): Block {
  return {
    id: crypto.randomUUID(),
    type,
    position: Date.now(),
    content: type === 'image' ? 'https://via.placeholder.com/400x300' : '',
    styles: { /* ... */ },
    microInteractions: { hover: '', click: '', scroll: '' },
    themeLocked: false,
    // ❌ Missing: microInteractionsLocked
  }
}
```

**Updated Code (NEW):**
```typescript
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
    microInteractions: { hover: '', click: '', scroll: '' },
    themeLocked: false,
    microInteractionsLocked: false,  // ✅ ADDED
  }
}
```

**Test**:
- Add a new block
- Check block object in console
- Should have `microInteractionsLocked: false`

**Commit**: `fix: add microInteractionsLocked to default block creation`

---

### Step M5: Install Sheet Component (If Not Done)

**What**: Add shadcn Sheet component for mobile drawer
**Files**: `src/components/ui/sheet.tsx`

**Actions**:
```bash
npx shadcn@latest add sheet
```

**Test**:
- Check `src/components/ui/sheet.tsx` exists
- Import Sheet components, no errors

**Commit**: `feat: add sheet component for mobile drawer`

---

### Step M6: Make BlockEditor Responsive (Popover + Sheet)

**What**: Update BlockEditor to detect viewport and use Popover/Sheet accordingly
**Files**: `src/components/builder/BlockEditor.tsx`

**Current Code (OLD - Popover only):**
```typescript
export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-80">
        {/* editor content */}
      </PopoverContent>
    </Popover>
  )
}
```

**Updated Code (NEW - Responsive):**
```typescript
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'

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
      {/* All editor controls go here */}
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

**Test**:
- Desktop (≥ 768px): Popover appears on right
- Mobile (< 768px): Drawer slides from bottom
- Resize window: switches automatically

**Commit**: `feat: make block editor responsive (popover + sheet)`

---

### Step M7: Add Debouncing Emphasis to Content Editing

**What**: Ensure content editing uses debouncing with clear comments
**Files**: `src/components/builder/BlockEditor.tsx`

**Verify/Update Code:**
```typescript
import { useDebounceCallback } from 'usehooks-ts'

export function BlockEditor({ block, open, onOpenChange, children }: BlockEditorProps) {
  const { updateBlock } = useBuilderStore()
  const [content, setContent] = useState(block.content)

  // ✅ DEBOUNCED UPDATE: Prevents constant re-renders while typing
  // User sees immediate feedback in local state,
  // but store updates only after 500ms pause (PERFORMANCE)
  const debouncedUpdate = useDebounceCallback((newContent: string) => {
    updateBlock(block.id, { content: newContent })
  }, 500)

  const handleContentChange = (newContent: string) => {
    setContent(newContent) // Update local state immediately (smooth UX)
    debouncedUpdate(newContent) // Update store with delay (performance)
  }

  // ... rest of component
}
```

**Test**:
- Type quickly in textarea
- Content appears immediately in textarea
- Store updates after 500ms pause
- No lag or stuttering

**Commit**: `feat: emphasize debounced content editing for performance`

---

### Step M8: Add Theme Apply Button (Remove Auto-Apply)

**What**: Add "Apply Theme" button to ThemesSection (don't apply on click)
**Files**: `src/components/sidebar/ThemesSection.tsx`

**Current Code (OLD - Auto-apply on click):**
```typescript
const handleThemeClick = (themeKey: string) => {
  applyGlobalTheme(themes[themeKey])  // ❌ Applies immediately
  toast({ title: 'Theme applied' })
}

return (
  <button onClick={() => handleThemeClick(key)}>
    {/* theme card */}
  </button>
)
```

**Updated Code (NEW - Select then Apply):**
```typescript
const [selectedTheme, setSelectedTheme] = useState<string>('minimal')

const handleApplyTheme = () => {
  applyGlobalTheme(themes[selectedTheme])
  toast({
    title: 'Theme applied',
    description: `${themes[selectedTheme].name} theme applied`,
  })
}

return (
  <>
    <div className="grid grid-cols-2 gap-2 mb-3">
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => setSelectedTheme(key)}  // ✅ Just selects
          className={selectedTheme === key ? 'border-primary bg-accent' : ''}
        >
          {/* theme card */}
        </button>
      ))}
    </div>
    
    {/* ✅ APPLY BUTTON: Expensive operation requires confirmation */}
    <Button onClick={handleApplyTheme} className="w-full" size="sm">
      Apply Theme
    </Button>
  </>
)
```

**Test**:
- Click theme cards: selection changes (visual only)
- Click "Apply Theme": blocks update

**Commit**: `feat: add apply button to themes (expensive operation)`

---

### Step M9: Add Micro-Interactions System (If Not Started)

**What**: Implement global and per-block micro-interactions with locks
**Files**: 
- `src/store/builderStore.ts` (add actions)
- `src/components/sidebar/MicroInteractionsSection.tsx` (new)
- `src/components/builder/BlockEditor.tsx` (add lock toggle)

**Follow**: Phase 8 from corrected plan Part 2

**Test**:
- Apply global micro-interactions from sidebar
- Lock block, verify it's not affected
- Apply per-block micro-interactions

**Commit**: `feat: add micro-interactions system with dual locks`

---

### Step M10: Update Documentation

**What**: Update Context.md to reflect corrections
**Files**: `Context.md`

**Add/Update sections:**
- Mobile editing is supported (Sheet/Drawer)
- Live preview vs Apply button distinction
- Dual lock system (theme + microInteractions)
- Dashboard IS the builder (no routing)

**Test**: Review docs for accuracy

**Commit**: `docs: update context with corrected implementation details`

---

## Verification Checklist

After migration, verify:

- [ ] `Block` type has `microInteractionsLocked: boolean`
- [ ] Store has `globalMicroInteractions` state
- [ ] BlockEditor is responsive (Popover + Sheet)
- [ ] Content editing uses 500ms debounce
- [ ] CSS changes have LIVE preview (no apply button)
- [ ] Themes have APPLY button (expensive operation)
- [ ] Micro-interactions have APPLY button
- [ ] Both lock systems work (theme + microInteractions)
- [ ] Default blocks include both lock properties
- [ ] Documentation reflects all corrections

---

## Testing After Migration

Run through complete workflow:

1. **Add Block**: Should have both locks set to false
2. **Edit Content**: Should debounce (500ms delay to store)
3. **Edit Styles** (font, color, margin): Should update INSTANTLY
4. **Apply Theme** (global): Should update unlocked blocks only
5. **Lock Block Theme**: Global theme shouldn't affect it
6. **Apply Micro-Interactions** (global): Should update unlocked blocks only
7. **Lock Block Interactions**: Global interactions shouldn't affect it
8. **Mobile Test**: Resize < 768px, editor should use Sheet
9. **Desktop Test**: Resize ≥ 768px, editor should use Popover

---

## Summary

This migration corrects 5 critical misalignments:

1. ✅ Responsive editing (Popover + Sheet)
2. ✅ Live vs Apply button UX
3. ✅ Dual lock system
4. ✅ Debouncing emphasis
5. ✅ Correct architecture documentation

**Follow steps M1-M10 sequentially, test after each, commit after each.**