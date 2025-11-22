# Linq Builder Development - Context for AI Assistants (CORRECTED)

**Quick Reference Guide for AI Support - Aligned with Chat History Agreements**

This document provides context about the CORRECTED Linq builder implementation plan and development workflow.

---

## 📋 Implementation Plan Overview

### Plan Structure

**50+ micro-steps** across **10 phases** - each 5-15 minutes:

| Phase | Steps | Focus Area | Duration |
|-------|-------|------------|----------|
| **0** | 5 | Foundation (Zustand, Toast, Sheet, Types) | ~1 hour |
| **1** | 3 | Zustand Store Setup | ~45 min |
| **2** | 4 | Canvas & Block Rendering | ~1 hour |
| **3** | 3 | Add Block Modal | ~45 min |
| **4** | 2 | Responsive Block Editor (Popover + Sheet) | ~30 min |
| **5** | 1 | Debounced Content Editing (500ms) | ~15 min |
| **6** | 4 | Live Preview Style Editing | ~1 hour |
| **7** | 5 | Themes (Global + Locks + Apply Button) | ~1.5 hours |
| **8** | 4 | Micro-Interactions (Global + Locks + Apply) | ~1 hour |
| **9** | 4 | Undo/Redo System | ~1 hour |
| **10** | 4 | Documentation & Polish | ~1 hour |

**Total: ~10-12 hours**

---

## 🎯 Critical Architectural Decisions (From Chat History)

### 1. Responsive Editing (NOT Desktop-Only)

**❌ WRONG:**
```typescript
// Old plan: Desktop-only Popover
<Popover>{children}</Popover>
```

**✅ CORRECT:**
```typescript
// Corrected plan: Responsive based on viewport
const [isMobile, setIsMobile] = useState(false)

if (isMobile) {
  return <Sheet side="bottom">{children}</Sheet>  // Mobile: Drawer
}
return <Popover side="right">{children}</Popover>  // Desktop: Popover
```

**Why**: Users MUST be able to edit on mobile. This is non-negotiable.

### 2. Live Preview vs Apply Button

**CRITICAL DISTINCTION:**

**✅ LIVE Preview (Instant, No Button):**
- Font size, color, family, weight
- Margin, padding
- Border width, color, radius
- Background colors

**Why**: CSS changes are CHEAP to compute. Instant feedback is better UX.

```typescript
// ✅ CORRECT: Direct update, no debounce
const handleStyleChange = (property, value) => {
  updateBlock(block.id, { styles: { [property]: value } })
}
```

**✅ APPLY Button (User Must Click):**
- Themes (expensive recalculations across all blocks)
- Micro-interactions (animation preview complex)

**Why**: Expensive operations need user confirmation.

```typescript
// ✅ CORRECT: Select then apply pattern
const [selectedTheme, setSelectedTheme] = useState('minimal')

// Just select (no application)
<button onClick={() => setSelectedTheme(key)}>Select</button>

// Apply requires button click
<Button onClick={() => applyGlobalTheme(themes[selectedTheme])}>
  Apply Theme
</Button>
```

### 3. Debounced Content Editing

**❌ WRONG:**
```typescript
// No debouncing - causes re-renders on every keystroke
const handleChange = (content) => {
  updateBlock(block.id, { content })
}
```

**✅ CORRECT:**
```typescript
// 500ms debounce - smooth typing, delayed store update
const [content, setContent] = useState(block.content)

const debouncedUpdate = useDebounceCallback((newContent) => {
  updateBlock(block.id, { content: newContent })
}, 500)

const handleChange = (newContent) => {
  setContent(newContent)  // Local state: INSTANT
  debouncedUpdate(newContent)  // Store: DELAYED 500ms
}
```

**Why**: Typing feels smooth (local state instant), but store doesn't re-render constantly (performance).

### 4. Dual Lock System

**❌ WRONG:**
```typescript
// Old plan: Single lock
type Block = {
  themeLocked: boolean
  // Missing: microInteractionsLocked
}
```

**✅ CORRECT:**
```typescript
// Corrected plan: Two independent locks
type Block = {
  themeLocked: boolean
  microInteractionsLocked: boolean  // MUST be separate
}
```

**Why**: Users should be able to lock theme but NOT interactions, or vice versa.

```typescript
// ✅ CORRECT: Check respective lock for each operation
applyGlobalTheme: (theme) => set((state) => ({
  blocks: state.blocks.map(block => {
    if (block.themeLocked) return block  // Skip locked
    return { ...block, styles: { /* apply theme */ } }
  })
}))

applyGlobalMicroInteractions: (interactions) => set((state) => ({
  blocks: state.blocks.map(block => {
    if (block.microInteractionsLocked) return block  // Skip locked
    return { ...block, microInteractions: interactions }
  })
}))
```

---

## 🧪 Auto-Testing Requirements (CRITICAL)

### After EVERY Micro-Step - 3 Tests Required

**Never skip testing. Every step MUST pass all 3 tests before committing.**

#### Test 1: Console Test (State Verification)

```typescript
// What to log to verify functionality
console.log(useBuilderStore.getState().blocks)
// Expected: [Array with new block having both locks]

console.log(useBuilderStore.getState().globalMicroInteractions)
// Expected: { hover: '', click: '', scroll: '' }
```

#### Test 2: Visual Test (UI Verification)

```
Desktop (≥ 768px):
- Click block → Popover appears on RIGHT
- Change font size → Updates INSTANTLY
- Click outside → Popover closes

Mobile (< 768px):
- Click block → Drawer slides up from BOTTOM
- Type in content → Debounces 500ms
- Swipe down → Drawer closes

Both:
- Add block → Appears on canvas
- Toast notification → Shows briefly
- Delete block → Disappears immediately
```

#### Test 3: Persistence Test (Storage Verification)

```
1. Add a block
2. Change styles
3. Apply theme
4. Refresh page (Ctrl+R / Cmd+R)

Expected:
- Block still there (localStorage)
- Styles preserved
- Theme NOT applied again (stored in DB)
- Check DevTools → Application → Local Storage → 'linq-builder-storage'
```

### Auto-Testing Workflow

```bash
# After implementing step
npm run dev

# 1. Console test
# Open DevTools Console
# Run test commands

# 2. Visual test
# Interact with UI
# Verify expected behavior

# 3. Persistence test
# Refresh page
# Verify data persists

# Only commit when ALL 3 tests pass
git add .
git commit -m "feat: [exact message from plan]"
```

---

## 🔧 Core Technical Principles

### Hybrid Styling (NEVER Mix)

**Inline Styles** (user-customizable values):
```typescript
// ✅ CORRECT
<div style={{
  fontSize: `${block.styles.fontSize}px`,
  color: block.styles.color,
  backgroundColor: block.styles.backgroundColor,
}}>
```

**Tailwind Classes** (micro-interactions ONLY):
```typescript
// ✅ CORRECT
<div className={cn(
  block.microInteractions.hover,  // 'hover:scale-105'
  block.microInteractions.click,  // 'active:scale-95'
)}>
```

**❌ NEVER Mix:**
```typescript
// ❌ WRONG
<div className="text-[24px] bg-[#FF0000]">  // Don't use Tailwind for custom values
<div style={{ transition: 'all 0.2s' }}>  // Don't use inline for animations
```

### TypeScript Strictness

**No `any` types. EVER.**

```typescript
// ✅ CORRECT
const handleStyleChange = (
  property: keyof Block['styles'],
  value: string | number
) => { /* ... */ }

// ❌ WRONG
const handleStyleChange = (property: any, value: any) => { /* ... */ }
```

### Database Operations

**ALWAYS server actions. NEVER client-side Supabase.**

```typescript
// ✅ CORRECT
'use server'
export async function savePage(data: PageInsert) {
  const supabase = await createClient()  // Server-side
  // ... safe operation
}

// ❌ WRONG
'use client'
const supabase = createClient()  // Client-side - BYPASSES RLS!
await supabase.from('pages').insert(data)
```

---

## 🚨 Common Gotchas (Things to Avoid)

### 1. Mobile Editing Not Supported

```typescript
// ❌ WRONG: Popover only
<Popover>{children}</Popover>

// ✅ CORRECT: Responsive
{isMobile ? <Sheet /> : <Popover />}
```

### 2. Auto-Apply Theme (No Button)

```typescript
// ❌ WRONG: Applies immediately
<button onClick={() => applyGlobalTheme(theme)}>

// ✅ CORRECT: Select then apply
<button onClick={() => setSelectedTheme(key)}>
<Button onClick={() => applyGlobalTheme(themes[selectedTheme])}>
  Apply Theme
</Button>
```

### 3. Single Lock System

```typescript
// ❌ WRONG: One lock for everything
if (block.themeLocked) return block

// ✅ CORRECT: Check specific lock
if (block.themeLocked) return block  // For themes
if (block.microInteractionsLocked) return block  // For interactions
```

### 4. Missing Debounce on Content

```typescript
// ❌ WRONG: Direct update
onChange={(e) => updateBlock(id, { content: e.target.value })}

// ✅ CORRECT: Debounced update
const debouncedUpdate = useDebounceCallback((content) => {
  updateBlock(id, { content })
}, 500)
```

### 5. No Testing Before Commit

```typescript
// ❌ WRONG: Commit immediately after coding
git add .
git commit -m "feat: add feature"

// ✅ CORRECT: Test THEN commit
// 1. Console test
// 2. Visual test
// 3. Persistence test
// ALL PASS? → Then commit
git add .
git commit -m "feat: add feature"
```

---

## 💡 AI Assistant Guidelines

### What Mohamed Expects

**When Mohamed says "build Step X.Y":**
1. Provide exact code from corrected plan
2. Explain what it does (ELI5)
3. Provide ALL 3 tests
4. Remind to run tests BEFORE committing
5. Provide commit message

**When Mohamed says "tests failed":**
1. Ask which test failed (console/visual/persistence)
2. Ask for exact error message
3. Debug step-by-step
4. Never skip to next step until tests pass

**When implementing:**
- ✅ Use responsive BlockEditor (Popover + Sheet)
- ✅ Use live preview for CSS changes
- ✅ Use apply button for themes/interactions
- ✅ Use 500ms debounce for content
- ✅ Use dual lock system
- ✅ Test EVERY step (3 tests)
- ✅ Commit AFTER tests pass

**Never:**
- ❌ Skip testing
- ❌ Use desktop-only Popover
- ❌ Auto-apply expensive operations
- ❌ Use single lock system
- ❌ Skip debouncing
- ❌ Commit before testing

---

## 📚 Key Documents Reference

### Document Priority

1. **migration-plan-correct-implementation.md** - Use if agent already started
2. **complete-implementation-plan-corrected.md** (Part 1) - Phases 0-4
3. **complete-implementation-plan-part2-corrected.md** (Part 2) - Phases 5-10
4. **This document** - Workflow and testing requirements

### When to Reference Each

**Migration Plan** - If implementation already started:
- Steps M1-M10 correct existing code
- Adds missing features (Sheet, dual locks, apply buttons)

**Corrected Plan Part 1** - Starting fresh (Phases 0-4):
- Foundation setup
- Store creation
- Canvas and rendering
- Responsive block editor

**Corrected Plan Part 2** - Advanced features (Phases 5-10):
- Debounced content editing
- Live preview style editing
- Themes with apply button
- Micro-interactions with apply button

---

## 🎯 Success Metrics

### Step Complete When:

✅ All 3 tests pass:
- Console shows expected state
- Visual UI shows expected behavior
- Refresh preserves changes

✅ No TypeScript errors

✅ No console errors/warnings

✅ Code matches corrected plan exactly

✅ Commit made with exact message from plan

### Phase Complete When:

✅ All steps in phase completed

✅ End-to-end testing passes

✅ Mobile + Desktop tested

✅ Ready for next phase

---

## 🚀 Quick Start Checklist

Before starting:

- [ ] Read migration plan if agent already started
- [ ] Download all corrected plan documents
- [ ] Understand 3-test requirement per step
- [ ] Know the 5 critical differences (responsive, live/apply, dual locks, debounce, auto-test)
- [ ] Git repo is clean
- [ ] Node.js and npm installed
- [ ] Terminal open in project directory

---

## 📖 Summary

**Corrected implementation has 5 critical requirements:**

1. ✅ **Responsive Editing** - Popover (desktop) + Sheet (mobile)
2. ✅ **Live vs Apply** - CSS instant, themes/interactions need button
3. ✅ **Dual Locks** - themeLocked + microInteractionsLocked
4. ✅ **Debouncing** - 500ms for content (performance)
5. ✅ **Auto-Testing** - 3 tests per step (console + visual + persistence)

**Never skip testing. Never commit without passing tests. Never implement old plan patterns.**

---

**When in doubt, check the corrected plan. When still in doubt, ask Mohamed. Never guess or use old patterns.** 🎯