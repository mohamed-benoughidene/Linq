# Linq Builder - Implementation Instructions (CORRECTED)

**Complete guidelines for building the Linq builder - Aligned with chat history**

---

## 🎯 Critical Requirements (Must Read First)

### 1. Responsive Editing (Mobile + Desktop)

**Users MUST be able to edit on mobile.**

```typescript
// ✅ CORRECT Implementation
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768)
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])

// Mobile: Sheet/Drawer
if (isMobile) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="bottom">
      <SheetContent className="h-[80vh]">
        {editorContent}
      </SheetContent>
    </Sheet>
  )
}

// Desktop: Popover
return (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverContent side="right">
      {editorContent}
    </PopoverContent>
  </Popover>
)
```

### 2. Live Preview vs Apply Button

**CSS changes = LIVE (instant)**  
**Themes/Interactions = APPLY (button required)**

```typescript
// ✅ LIVE Preview (cheap CSS)
const handleStyleChange = (property: keyof Block['styles'], value: string | number) => {
  updateBlock(block.id, {
    styles: { ...block.styles, [property]: value }
  })
}

<Input
  value={block.styles.fontSize || 16}
  onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
/>

// ✅ APPLY Button (expensive operations)
const [selectedTheme, setSelectedTheme] = useState('minimal')

<button onClick={() => setSelectedTheme(key)}>
  {theme.name}  {/* Just selects, doesn't apply */}
</button>

<Button onClick={() => applyGlobalTheme(themes[selectedTheme])}>
  Apply Theme  {/* User must click to apply */}
</Button>
```

### 3. Dual Lock System

**Two independent locks - NEVER one lock for both.**

```typescript
// ✅ CORRECT Types
type Block = {
  themeLocked: boolean
  microInteractionsLocked: boolean  // Separate lock
}

// ✅ CORRECT Application Logic
applyGlobalTheme: (theme) => set((state) => ({
  blocks: state.blocks.map(block => {
    if (block.themeLocked) return block  // Check theme lock
    return { ...block, styles: { /* apply theme */ } }
  })
}))

applyGlobalMicroInteractions: (interactions) => set((state) => ({
  blocks: state.blocks.map(block => {
    if (block.microInteractionsLocked) return block  // Check interactions lock
    return { ...block, microInteractions: interactions }
  })
}))
```

### 4. Debounced Content Editing

**500ms debounce for typing - smooth UX + performance.**

```typescript
// ✅ CORRECT Implementation
import { useDebounceCallback } from 'usehooks-ts'

const [content, setContent] = useState(block.content)

// Debounced update: Store updates after 500ms pause
const debouncedUpdate = useDebounceCallback((newContent: string) => {
  updateBlock(block.id, { content: newContent })
}, 500)

const handleContentChange = (newContent: string) => {
  setContent(newContent)  // Local state: INSTANT
  debouncedUpdate(newContent)  // Store: DELAYED 500ms
}
```

### 5. Auto-Testing Every Step

**NEVER commit without passing all 3 tests.**

See "Auto-Testing Requirements" section below.

---

## 🧪 Auto-Testing Requirements (MANDATORY)

### After EVERY micro-step, run ALL 3 tests:

#### Test 1: Console Test

**Verify state is correct.**

```typescript
// Example tests for different steps:

// After adding block:
console.log(useBuilderStore.getState().blocks)
// Expected: Array with 1+ blocks, each having themeLocked and microInteractionsLocked

// After updating store:
console.log(useBuilderStore.getState().globalMicroInteractions)
// Expected: { hover: '', click: '', scroll: '' }

// After applying theme:
const unlocked = useBuilderStore.getState().blocks.filter(b => !b.themeLocked)
console.log(unlocked.every(b => b.styles.fontFamily === 'Arial'))
// Expected: true (if theme font is Arial)
```

#### Test 2: Visual Test

**Verify UI behaves correctly.**

```
Desktop Test (≥ 768px):
1. Click block
   → Popover appears on RIGHT side
2. Change font size
   → Block text size updates INSTANTLY
3. Change font color
   → Block color updates INSTANTLY
4. Select theme + click "Apply Theme"
   → All unlocked blocks update
5. Click outside popover
   → Popover closes

Mobile Test (< 768px):
1. Resize browser window to < 768px
2. Click block
   → Sheet/Drawer slides up from BOTTOM
3. Type in content textarea
   → Text appears immediately
   → Store updates after 500ms pause
4. Swipe down or click outside
   → Drawer closes

Both Desktop & Mobile:
1. Add block
   → Block appears on canvas
   → Toast notification shows
2. Delete block
   → Block disappears
   → Toast notification shows
3. Duplicate block
   → New identical block appears
```

#### Test 3: Persistence Test

**Verify data persists across refresh.**

```
1. Add a block with custom content
2. Change styles (font size, color)
3. Apply a theme
4. Lock the block
5. Refresh page (Ctrl+R / Cmd+R)

Expected:
✅ Block still exists
✅ Content preserved
✅ Styles preserved
✅ Lock state preserved
✅ Theme NOT auto-applied again

Check:
- DevTools → Application → Local Storage
- Key: 'linq-builder-storage'
- Value should contain blocks array with all data
```

### Testing Workflow

```bash
# 1. Implement step according to plan
# 2. Start dev server
npm run dev

# 3. Run Test 1 (Console)
# Open DevTools Console (F12)
# Execute console test commands
# Verify expected output

# 4. Run Test 2 (Visual)
# Interact with UI on desktop
# Resize to mobile, test again
# Verify all expected behaviors

# 5. Run Test 3 (Persistence)
# Make changes
# Refresh page
# Verify everything persists

# 6. Only if ALL 3 tests pass:
git add .
git commit -m "[exact message from plan]"
```

---

## 🔧 Tech Stack & Patterns

### State Management (Zustand)

**ALL builder state in Zustand store.**

```typescript
// ✅ CORRECT
const { blocks, addBlock, updateBlock } = useBuilderStore()

// ❌ WRONG - Don't create local state for blocks
const [blocks, setBlocks] = useState([])
```

### Styling System (Hybrid)

**Inline styles for custom values, Tailwind for micro-interactions.**

```typescript
// ✅ CORRECT - Inline for custom values
<div style={{
  fontSize: `${block.styles.fontSize}px`,
  color: block.styles.color,
  backgroundColor: block.styles.backgroundColor,
  margin: `${block.styles.margin}px`,
  padding: `${block.styles.padding}px`,
}}>

// ✅ CORRECT - Tailwind for micro-interactions
<div className={cn(
  block.microInteractions.hover,  // 'hover:scale-105'
  block.microInteractions.click,  // 'active:scale-95'
  block.microInteractions.scroll, // 'animate-fade-in'
)}>

// ❌ WRONG - Don't use Tailwind for custom values
<div className="text-[24px] bg-[#FF0000]">

// ❌ WRONG - Don't use inline for animations
<div style={{ transition: 'all 0.2s' }}>
```

**Why Hybrid?**
- Inline = any value → Easy JSON storage in database
- Tailwind = predefined → Perfect for animations (string values)

### TypeScript Strictness

**No `any` types allowed.**

```typescript
// ✅ CORRECT
const handleStyleChange = (
  property: keyof Block['styles'],
  value: string | number
) => {
  updateBlock(block.id, {
    styles: { ...block.styles, [property]: value }
  })
}

// ❌ WRONG
const handleStyleChange = (property: any, value: any) => {
  // TypeScript strict mode will reject this
}
```

### Database Operations

**Always server actions, never client-side Supabase.**

```typescript
// ✅ CORRECT - Server action
'use server'
import { createClient } from '@/utils/supabase/server'

export async function savePage(data: PageInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { success: false, error: 'Not authenticated' }
  
  // RLS protects this automatically
  const { error } = await supabase
    .from('pages')
    .insert({ ...data, user_id: user.id })
  
  return { success: !error, error: error?.message }
}

// ❌ WRONG - Client-side (bypasses RLS)
'use client'
const supabase = createClient()
await supabase.from('pages').insert(data)
```

---

## 🚨 Common Mistakes to Avoid

### 1. Desktop-Only Popover

```typescript
// ❌ WRONG
export function BlockEditor({ block, children }: Props) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>{/* editor */}</PopoverContent>
    </Popover>
  )
}

// ✅ CORRECT
export function BlockEditor({ block, children }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  if (isMobile) {
    return <Sheet>{/* mobile editor */}</Sheet>
  }
  
  return <Popover>{/* desktop editor */}</Popover>
}
```

### 2. Auto-Apply Expensive Operations

```typescript
// ❌ WRONG - Applies theme immediately on click
const handleThemeClick = (themeKey: string) => {
  applyGlobalTheme(themes[themeKey])  // Too expensive!
}

<button onClick={() => handleThemeClick(key)}>
  {theme.name}
</button>

// ✅ CORRECT - Select then apply pattern
const [selectedTheme, setSelectedTheme] = useState('minimal')

const handleApplyTheme = () => {
  applyGlobalTheme(themes[selectedTheme])  // User confirms
}

<button onClick={() => setSelectedTheme(key)}>
  {theme.name}  {/* Just selection */}
</button>

<Button onClick={handleApplyTheme}>
  Apply Theme  {/* Requires click */}
</Button>
```

### 3. Single Lock for Both Features

```typescript
// ❌ WRONG
type Block = {
  themeLocked: boolean
  // Missing: microInteractionsLocked
}

if (block.themeLocked) {
  // Skip both theme AND interactions
}

// ✅ CORRECT
type Block = {
  themeLocked: boolean
  microInteractionsLocked: boolean
}

// Apply theme
if (block.themeLocked) return block

// Apply interactions (separate check)
if (block.microInteractionsLocked) return block
```

### 4. No Debouncing on Content Input

```typescript
// ❌ WRONG - Re-renders on every keystroke
<Textarea
  value={block.content}
  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
/>

// ✅ CORRECT - Debounced updates
const [content, setContent] = useState(block.content)

const debouncedUpdate = useDebounceCallback((newContent) => {
  updateBlock(block.id, { content: newContent })
}, 500)

const handleContentChange = (newContent: string) => {
  setContent(newContent)
  debouncedUpdate(newContent)
}

<Textarea value={content} onChange={(e) => handleContentChange(e.target.value)} />
```

### 5. Committing Without Testing

```typescript
// ❌ WRONG
// Write code → Commit immediately
git add .
git commit -m "feat: add feature"

// ✅ CORRECT
// Write code → Test 1 (console) → Test 2 (visual) → Test 3 (persistence) → Commit
git add .
git commit -m "feat: add feature"
```

---

## 📁 File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx              # Main builder page
│   └── actions/
│       └── pages.ts               # Server actions (DB operations)
│
├── components/
│   ├── builder/
│   │   ├── Canvas.tsx             # Orchestrator (displays blocks)
│   │   ├── BlockRenderer.tsx      # Read-only (renders blocks)
│   │   ├── BlockEditor.tsx        # Write-only (edits blocks) - RESPONSIVE
│   │   └── AddBlockModal.tsx      # Block type selection
│   │
│   ├── sidebar/
│   │   ├── ThemesSection.tsx      # Theme picker with APPLY button
│   │   └── MicroInteractionsSection.tsx  # Interactions with APPLY button
│   │
│   └── ui/                        # shadcn components
│       ├── popover.tsx
│       ├── sheet.tsx              # For mobile drawer
│       └── ...
│
├── store/
│   └── builderStore.ts            # Zustand store (single source of truth)
│
├── lib/
│   └── themes.ts                  # Predefined theme definitions
│
└── types/
    ├── builder.ts                 # Builder-specific types
    └── database.ts                # Database record types
```

---

## 📝 Git Workflow

### Commit After EVERY Step

```bash
# After step completes AND passes all 3 tests
git add .
git commit -m "[exact message from plan]"

# Examples:
git commit -m "feat: add sheet component for mobile editing"
git commit -m "feat: make block editor responsive (popover + sheet)"
git commit -m "feat: add live preview typography controls"
git commit -m "feat: add apply button to themes (expensive operation)"
```

### Commit Message Format

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructuring
- docs: Documentation
- chore: Tooling/dependencies
- perf: Performance improvement
```

---

## 🎓 Key Learnings

By following this plan, you'll understand:

✅ Zustand state management with persistence  
✅ Hybrid styling (inline + Tailwind) and when to use each  
✅ Responsive UI (Popover + Sheet based on viewport)  
✅ Live preview vs Apply button UX patterns  
✅ Dual lock system architecture  
✅ Debouncing for performance  
✅ Server actions for database operations  
✅ TypeScript strict mode development  
✅ Auto-testing workflow (3 tests per step)  
✅ Micro-step incremental development  

---

## 📖 Quick Reference

### Live Preview (Instant)

- Font size, color, family, weight
- Margin, padding
- Border width, color, radius
- Background color

### Apply Button (User Confirmation)

- Themes (global or per-block)
- Micro-interactions (global or per-block)

### Dual Lock System

- `themeLocked: boolean` - Prevents global theme changes
- `microInteractionsLocked: boolean` - Prevents global interaction changes

### Responsive Breakpoint

- Desktop: ≥ 768px → Popover (right side)
- Mobile: < 768px → Sheet/Drawer (bottom)

### Debounce Timing

- Content editing: 500ms
- Style changes: 0ms (instant)
- Theme/interactions: N/A (apply button)

---

## 🚀 Ready to Build

**Follow the corrected plan step-by-step:**

1. Start with Phase 0 (Foundation)
2. Complete each step in order
3. **Test after every step** (3 tests)
4. **Commit after tests pass**
5. Move to next step only when current passes

**Never skip ahead. Never skip testing. Never commit untested code.**

---

**When in doubt, check the corrected plan. When still in doubt, ask Mohamed. Never guess.** 🎯