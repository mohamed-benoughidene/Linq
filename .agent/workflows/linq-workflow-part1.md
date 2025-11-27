# Linq Feature Expansion - Workflow Part 1/4

**AI Agent Workflow for Implementing Missing Features**

---

## 🎯 Mission & Context

### What is Linq?

Linq is a **link-in-bio page builder** that allows creators to:
1. Build custom landing pages with a visual block editor
2. Publish pages at `username.linq.io/page-slug` or custom domains
3. Share their link-in-bio across social media platforms

### Current Status

✅ **COMPLETE:** Builder system (Phases 0-9)
- Block-based editor with Heading, Paragraph, Image, Link blocks
- Theme system with global/per-block application
- Micro-interactions system (hover, click, scroll effects)
- Undo/Redo with keyboard shortcuts
- Auto-save and database persistence structure
- Mobile-responsive editing (Sheet component)

❌ **CRITICAL GAP:** No public viewing or page management
- Users cannot view published pages
- No page list/management interface
- No publish/unpublish workflow
- Builder is not connected to page routing

**Your Mission:** Implement the missing features to make Linq a complete, usable product.

---

## 🏗️ Architecture Overview

### Tech Stack

- **Framework:** Next.js 15 App Router (TypeScript)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **State:** Zustand with localStorage persistence
- **UI:** shadcn/ui + Tailwind CSS v4
- **Security:** Upstash Redis for rate limiting

### Database Schema

```sql
-- ✅ EXISTS
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ EXISTS
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  blocks JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);
```

### Required RLS Policies

```sql
-- Public read: only published pages
CREATE POLICY "Public pages are viewable by everyone"
  ON pages FOR SELECT
  USING (is_published = true);

-- Owner full access
CREATE POLICY "Users can manage own pages"
  ON pages FOR ALL
  USING (auth.uid() = user_id);
```

### File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # ❌ UPDATE: page list
│   │   └── pages/                # ❌ NEW
│   │       ├── new/page.tsx      # ❌ NEW
│   │       └── [id]/page.tsx     # ❌ NEW: Builder
│   ├── [username]/[slug]/page.tsx # ❌ NEW: Public view
│   └── actions/pages.ts          # ✅ UPDATE: CRUD
│
├── components/
│   ├── builder/                  # ✅ COMPLETE - Don't touch
│   ├── dashboard/                # ❌ NEW
│   │   ├── PagesList.tsx
│   │   ├── PageCard.tsx
│   │   └── PageSetupForm.tsx
│   └── public/
│       └── PublicPageRenderer.tsx # ❌ NEW
│
├── store/builderStore.ts         # ⚠️ Minor updates
└── types/database.ts             # ⚠️ Add Page type
```

---

## 🚀 Implementation Phases

### Phase 1: Public Page Viewing (CRITICAL) 🔥

**Goal:** Users can share and view their published pages publicly.

**Steps:**
1. Create public page route (`/[username]/[slug]`)
2. Build PublicPageRenderer component
3. Add publish/unpublish toggle
4. Add share modal with copy link

### Phase 2: Page Management Dashboard

**Goal:** Users can create, manage, and organize multiple pages.

**Steps:**
1. Restructure dashboard routes
2. Build pages list UI
3. Add new page creation flow

### Phase 3: Database Persistence Integration

**Goal:** Builder properly saves/loads from database.

**Steps:**
1. Integrate auto-save
2. Add manual save with status indicator

---

## 🔄 Development Workflow

### For Each Implementation Step:

#### 1. Announce Implementation
```
"Implementing Phase X, Step X.Y: [Feature Name]

Files to create/modify:
- path/to/file1.tsx (NEW)
- path/to/file2.ts (UPDATE)"
```

#### 2. Provide Complete Code
- Copy exact code from workflow document
- Include all imports
- Add inline comments for clarity
- Use correct types from `@/types/`

#### 3. Explain the Code (ELI5)
```
"This code creates [feature] by:
1. [Step 1 explanation]
2. [Step 2 explanation]"
```

#### 4. Provide Testing Instructions
Always include all 3 tests:
- **Test 1:** Console commands with expected output
- **Test 2:** Visual checks (desktop + mobile)
- **Test 3:** Persistence verification

#### 5. Provide Commit Message
```bash
git add .
git commit -m "feat: [exact message from step]"
```

---

## 🧪 Testing Protocol

### Mandatory 3-Test System

**Never skip tests. Every feature must pass all 3 tests before committing.**

#### Test 1: Console Test
Verify state and data correctness via browser console.

#### Test 2: Visual Test
Verify UI behavior on both desktop (≥768px) and mobile (<768px).

#### Test 3: Persistence Test
Verify data persists across page refresh and database.

### Test Execution Order

```
1. Implement code
2. Save files
3. Run Test 1 → Pass? Continue : Debug
4. Run Test 2 → Pass? Continue : Debug
5. Run Test 3 → Pass? Commit : Debug
```

---

## 📐 Code Patterns & Standards

### Builder System Patterns (Don't Modify)

```typescript
// ✅ CORRECT - Hybrid styling
const styles = {
  fontSize: `${block.styles.fontSize}px`,
  color: block.styles.color,
};

const className = cn(
  block.microInteractions.hover,
  block.microInteractions.click,
);
```

### State Management

```typescript
// ✅ CORRECT - Use Zustand store
const { blocks, addBlock } = useBuilderStore();

// ❌ WRONG - Don't create local state
const [blocks, setBlocks] = useState([]);
```

### Server Actions Pattern

```typescript
// ✅ CORRECT - Server action with auth
'use server';

export async function myAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  // Perform action with RLS protection
}
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't Break Existing Builder** - Builder is complete, only add new features
2. **Don't Create Local State for Blocks** - Use Zustand store
3. **Don't Use Client-Side Database Calls** - Always use server actions
4. **Don't Skip RLS Policies** - Every table needs proper policies
5. **Don't Forget Mobile Testing** - Test on <768px viewport
6. **Don't Skip the 3 Tests** - All tests must pass before commit

---

**Continue to Part 2 for detailed implementation steps →**
