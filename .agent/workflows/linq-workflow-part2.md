# Linq Feature Expansion - Workflow Part 2/4

**Phase 1: Public Page Viewing Implementation**

---

## Phase 1, Step 1.1: Create Public Page Route

**Goal:** Allow users to view published pages at `/[username]/[slug]`

**Files to create:**
- `src/app/[username]/[slug]/page.tsx` (NEW)
- `src/components/public/PublicPageRenderer.tsx` (NEW)
- `src/types/database.ts` (UPDATE)

### Implementation

```typescript
// src/app/[username]/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { PublicPageRenderer } from '@/components/public/PublicPageRenderer';

interface PageProps {
  params: { username: string; slug: string; };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  
  const { data: page } = await supabase
    .from('pages')
    .select('*, profiles!inner(username)')
    .eq('profiles.username', params.username)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!page) return { title: 'Page Not Found' };

  return {
    title: page.seo_title || page.title,
    description: page.seo_description || `${page.title} - Linq`,
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || `${page.title} - Linq`,
      images: page.seo_image ? [page.seo_image] : [],
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const supabase = await createClient();
  
  const { data: page, error } = await supabase
    .from('pages')
    .select('*, profiles!inner(username, full_name, avatar_url)')
    .eq('profiles.username', params.username)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (error || !page) notFound();

  return <PublicPageRenderer page={page} />;
}
```

```typescript
// src/components/public/PublicPageRenderer.tsx
'use client';

import { Block } from '@/types/builder';
import { cn } from '@/lib/utils';

interface PublicPageRendererProps {
  page: {
    title: string;
    blocks: Block[];
    profiles: {
      username: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  };
}

export function PublicPageRenderer({ page }: PublicPageRendererProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-4xl mx-auto py-6 px-4">
          <div className="flex items-center gap-4">
            {page.profiles.avatar_url && (
              <img
                src={page.profiles.avatar_url}
                alt={page.profiles.full_name || page.profiles.username}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{page.title}</h1>
              <p className="text-muted-foreground">@{page.profiles.username}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Blocks */}
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-4">
          {page.blocks.length === 0 ? (
            <p className="text-center text-muted-foreground">This page is empty.</p>
          ) : (
            page.blocks.map((block) => (
              <PublicBlockRenderer key={block.id} block={block} />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container max-w-4xl mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
          <p>Made with <a href="/" className="underline">Linq</a></p>
        </div>
      </footer>
    </div>
  );
}

function PublicBlockRenderer({ block }: { block: Block }) {
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
  };

  const className = cn(
    block.microInteractions.hover,
    block.microInteractions.click,
    block.microInteractions.scroll,
    'transition-all'
  );

  switch (block.type) {
    case 'heading':
      return <h1 style={combinedStyles} className={className}>{block.content || 'Heading'}</h1>;
    case 'paragraph':
      return <p style={combinedStyles} className={className}>{block.content || 'Paragraph'}</p>;
    case 'image':
      return (
        <img
          src={block.content || 'https://via.placeholder.com/400x300'}
          alt={block.imageAlt || 'Image'}
          style={combinedStyles}
          className={className}
        />
      );
    case 'link':
      return (
        <a
          href={block.linkUrl || block.content || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={combinedStyles}
          className={className}
        >
          {block.linkText || block.content || 'Link'}
        </a>
      );
    default:
      return null;
  }
}
```

### Testing

**Test 1: Console**
```typescript
// Navigate to /testuser/mypage
console.log('Page loaded:', document.title);
// Expected: Page title from metadata
```

**Test 2: Visual**
- Desktop: Navigate to `/testuser/mypage` → See page with blocks
- Mobile: Resize to <768px → Page responsive, no scroll

**Test 3: Persistence**
- Create published page
- Navigate to public URL
- Refresh page → Still loads correctly

**Commit:**
```bash
git add .
git commit -m "feat: add public page viewing route with read-only renderer"
```

---

**Continue to Part 3 for more implementation steps →**
