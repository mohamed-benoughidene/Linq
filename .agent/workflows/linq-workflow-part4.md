# Linq Feature Expansion - Workflow Part 4/4

**Testing Protocols, Security, and Standards**

---

## 🧪 Complete Testing Protocol

### Mandatory 3-Test System for Every Feature

**Never skip tests. Every feature must pass all 3 tests before committing.**

### Test 1: Console Test
Verify state and data correctness via browser console.

**Example:**
```typescript
// After adding a block
console.log(useBuilderStore.getState().blocks);
// Expected: [array of blocks with correct data]

// After publishing
console.log(useBuilderStore.getState().isPublished);
// Expected: true
```

### Test 2: Visual Test
Verify UI behavior on both desktop (≥768px) and mobile (<768px).

**Desktop Example:**
1. Click publish toggle → Switch changes position
2. Toast notification appears → "Page published" message
3. Click share button → Modal opens with copy link

**Mobile Example:**
1. Resize browser to <768px width
2. Same actions as desktop
3. Sheet slides from bottom (not right side)
4. All touch interactions work

### Test 3: Persistence Test
Verify data persists across page refresh and database.

**Example:**
1. Publish a page
2. Refresh browser (Cmd+R / Ctrl+R)
3. Page should still show as published
4. Check database:
   ```sql
   SELECT is_published FROM pages WHERE id = 'page-id';
   ```
5. Navigate to public URL → Page should be visible

### Test Execution Order

```
1. Implement code from workflow
2. Save all files
3. Run Test 1 (Console)
   ├─ Pass? → Continue to Test 2
   └─ Fail? → Debug, fix, re-test Test 1
4. Run Test 2 (Visual)
   ├─ Desktop test → Pass?
   ├─ Mobile test → Pass?
   └─ Any fail? → Debug, fix, re-test Test 2
5. Run Test 3 (Persistence)
   ├─ Pass? → Continue to commit
   └─ Fail? → Debug, fix, re-test Test 3
6. All 3 tests pass? → Commit with exact message
7. Any test fails? → Do NOT commit, debug first
```

---

## 🔒 Security Checklist

### RLS Policies (Required)

Every database table must have Row Level Security policies:

```sql
-- Pages: Owner full access
CREATE POLICY "Users manage own pages"
  ON pages FOR ALL
  USING (auth.uid() = user_id);

-- Pages: Public read for published only
CREATE POLICY "Published pages are public"
  ON pages FOR SELECT
  USING (is_published = true);
```

### Server Action Security

Every server action must follow this pattern:

```typescript
'use server';

export async function myAction() {
  // 1. Get authenticated user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Check authentication
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  // 3. Perform action with ownership check
  const { error } = await supabase
    .from('pages')
    .update(data)
    .eq('id', pageId)
    .eq('user_id', user.id); // Critical ownership check
  
  // 4. Handle errors
  if (error) {
    return { success: false, error: error.message };
  }
  
  // 5. Revalidate cache
  revalidatePath('/dashboard');
  
  return { success: true };
}
```

### Public Route Security

```typescript
// Always check is_published for public routes
const { data: page } = await supabase
  .from('pages')
  .select('*')
  .eq('slug', slug)
  .eq('is_published', true) // Critical: only published
  .single();

if (!page) {
  notFound(); // 404 if not found or unpublished
}
```

---

## 📐 Code Standards

### TypeScript

```typescript
// ✅ CORRECT - Proper typing
interface MyProps {
  page: PageRecord;
  onDelete: (id: string) => void;
}

// ❌ WRONG - Using 'any'
function MyComponent(props: any) { // Never use 'any'
```

### State Management

```typescript
// ✅ CORRECT - Use Zustand store
const { blocks, addBlock } = useBuilderStore();

// ❌ WRONG - Don't create local state for blocks
const [blocks, setBlocks] = useState([]); // Never
```

### Styling

```typescript
// ✅ CORRECT - Inline for custom values
const styles = {
  fontSize: `${block.styles.fontSize}px`,
  color: block.styles.color,
};

// ✅ CORRECT - Tailwind for interactions
const className = cn(
  block.microInteractions.hover,
  'transition-all'
);
```

---

## ⚠️ Critical Pitfalls to Avoid

### 1. Don't Break Existing Builder
- Builder components in `src/components/builder/` are **complete**
- Only add new features, never refactor existing builder code
- Maintain all patterns: hybrid styling, debouncing, dual locks

### 2. Don't Create Local State for Blocks
```typescript
// ❌ WRONG
const [blocks, setBlocks] = useState([]);

// ✅ CORRECT
const { blocks } = useBuilderStore();
```

### 3. Don't Use Client-Side Database Calls
```typescript
// ❌ WRONG - Client component calling DB
'use client';
const supabase = createClient();
await supabase.from('pages').update(...);

// ✅ CORRECT - Server action
await updatePage(pageId, data);
```

### 4. Don't Skip RLS Policies
- Every table needs policies
- No policy = no access (secure by default)
- Test policies by trying to access other users' data

### 5. Don't Forget Mobile Testing
- Test on viewport <768px
- Sheet should slide from bottom on mobile
- No horizontal scroll
- Touch interactions must work

### 6. Don't Skip Any of the 3 Tests
```
❌ "It works on my machine"
✅ All 3 tests passed + committed
```

---

## 💡 Response Templates

### Starting a Step

```markdown
## Implementing Phase X, Step X.Y: [Feature Name]

**Goal**: [One sentence]

**Files:**
- path/to/file.tsx (NEW/UPDATE)

### Implementation
[Code blocks]

### Testing
**Test 1: Console**
[Commands and expected output]

**Test 2: Visual**
Desktop: [Actions → Results]
Mobile: [Actions → Results]

**Test 3: Persistence**
[Steps to verify persistence]

### Commit
```bash
git commit -m "[exact message]"
```

---

**Run all 3 tests before moving to next step!**
```

### When Tests Fail

```markdown
Let me help debug.

**Which test failed?**
- [ ] Test 1 (Console)
- [ ] Test 2 (Visual)  
- [ ] Test 3 (Persistence)

**What happened?**
[Wait for user response]

**Expected behavior:**
[From workflow]

**Common causes:**
1. [Check X]
2. [Verify Y]

Let's debug systematically...
```

---

## 🎯 Quality Checklist

### Before Marking Step Complete

- [ ] Code matches workflow document exactly
- [ ] All 3 tests provided with expected results
- [ ] Commit message provided
- [ ] ELI5 explanation provided
- [ ] User reminded to test before committing
- [ ] No improvisation or assumptions
- [ ] Types properly defined (no `any`)
- [ ] Server actions for database operations
- [ ] RLS policies verified

### Success Metrics

**Step Complete When:**
✅ Code implemented  
✅ Test 1 passed (console)  
✅ Test 2 passed (visual - desktop + mobile)  
✅ Test 3 passed (persistence)  
✅ Committed with exact message  

---

## 📚 Reference Files

**Priority order for checking:**
1. This workflow (Parts 1-4) - Complete specs
2. Context.md - Project conventions
3. instructions.md - Builder patterns (don't modify)
4. GitHub repo - Current state

**When in doubt:**
1. Check existing patterns in codebase
2. Ask clarifying questions
3. Never guess or improvise

---

**All 4 workflow parts now complete. Ready to implement! 🚀**
