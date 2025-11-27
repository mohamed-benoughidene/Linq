# Linq Feature Expansion - Workflow Part 3/4

**Phase 1 (continued) & Phase 2: Publishing & Page Management**

---

## Phase 1, Step 1.2: Add Publish/Unpublish Toggle

**Goal:** Allow users to publish/unpublish pages

**Files:**
- `src/components/builder/PublishToggle.tsx` (NEW)
- `src/app/actions/pages.ts` (UPDATE)
- `src/store/builderStore.ts` (UPDATE)

### Implementation

```typescript
// src/app/actions/pages.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function publishPage(pageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('pages')
    .update({ is_published: true, updated_at: new Date().toISOString() })
    .eq('id', pageId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

export async function unpublishPage(pageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('pages')
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq('id', pageId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deletePage(pageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

export async function createPage(title: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('user_id', user.id)
    .eq('slug', slug)
    .single();

  if (existing) {
    return { success: false, error: 'A page with this URL already exists' };
  }

  const { data: newPage, error } = await supabase
    .from('pages')
    .insert({
      user_id: user.id,
      title,
      slug,
      blocks: [],
      is_published: false,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true, pageId: newPage.id };
}
```

```typescript
// src/store/builderStore.ts (UPDATE - add publish state)
interface BuilderStore {
  // ... existing
  currentPageId: string | null;
  isPublished: boolean;
  
  setCurrentPageId: (id: string | null) => void;
  setIsPublished: (published: boolean) => void;
}

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set) => ({
      // ... existing
      currentPageId: null,
      isPublished: false,
      
      setCurrentPageId: (id) => set({ currentPageId: id }),
      setIsPublished: (published) => set({ isPublished: published }),
    }),
    { name: 'linq-builder-storage' }
  )
);
```

### Testing

**Test 1: Console**
```typescript
const { isPublished } = useBuilderStore.getState();
console.log('Published:', isPublished);
// Expected: true/false based on toggle
```

**Test 2: Visual**
- Toggle publish → Switch changes, toast appears
- Navigate to public URL → Page visible/404 based on status

**Test 3: Persistence**
```sql
SELECT is_published FROM pages WHERE id = 'page-id';
-- Should match toggle state
```

**Commit:**
```bash
git add .
git commit -m "feat: add publish/unpublish toggle with RLS protection"
```

---

## Phase 2: Page Management Dashboard

### Step 2.1: Restructure Dashboard Routes

**Goal:** Move builder to `/dashboard/pages/[id]`, show page list at `/dashboard`

**Files:**
- `src/app/dashboard/page.tsx` (UPDATE)
- `src/app/dashboard/pages/[id]/page.tsx` (NEW)

```typescript
// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { PagesList } from '@/components/dashboard/PagesList';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Pages</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your link-in-bio pages
        </p>
      </div>
      <PagesList pages={pages || []} />
    </div>
  );
}
```

### Testing

**Test 1: Console**
```typescript
console.log('Route:', window.location.pathname);
// Expected: /dashboard shows page list
```

**Test 2: Visual**
- Navigate to /dashboard → See page list
- Click page → Opens at /dashboard/pages/[id]

**Test 3: Persistence**
- Refresh /dashboard → Still shows page list

**Commit:**
```bash
git add .
git commit -m "refactor: restructure dashboard routes for page management"
```

---

**Continue to Part 4 for testing protocols and standards →**
