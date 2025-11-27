---
description: Step-by-step protocol for AI assistants building the Linq builder. Enforces corrected plan compliance, mandatory 3-test validation (console+visual+persistence), responsive editing (Popover+Sheet), live preview vs apply button patterns, and dual lock
---

# Linq Feature Expansion - Complete Workflow for AI Agents

**Last Updated:** November 27, 2025

***

## 📋 Table of Contents

1. [Mission & Context](#mission--context)
2. [Current State Analysis](#current-state-analysis)
3. [Architecture Overview](#architecture-overview)
4. [Implementation Phases](#implementation-phases)
5. [Development Workflow](#development-workflow)
6. [Testing Protocol](#testing-protocol)
7. [Code Patterns & Standards](#code-patterns--standards)
8. [Security Requirements](#security-requirements)

***

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

***

## 🔍 Current State Analysis

### What Works (Don't Touch)

✅ **Builder System** (`src/components/builder/`)
- `Canvas.tsx` - Orchestrator component
- `BlockRenderer.tsx` - Renders individual blocks
- `BlockEditor.tsx` - Responsive edit interface (Sheet on mobile/desktop)
- `ThemesSection.tsx` - Theme picker with Apply button
- `MicroInteractionsSection.tsx` - Interaction controls
- `AutoSaveManager.tsx` - 30-second auto-save
- `HeaderActions.tsx` - Undo/Redo buttons

✅ **State Management** (`src/store/builderStore.ts`)
- Zustand store with localStorage persistence
- Block CRUD operations
- Theme and micro-interaction application
- History tracking (undo/redo)
- Database save/load methods (exist but not fully integrated)

✅ **Authentication & Security**
- Secure signup with rate limiting (Upstash Redis)
- Google OAuth integration
- Email confirmation flow
- User enumeration prevention

### What's Missing (Your Tasks)

❌ **Public Page Viewing**
- No route to view published pages (`/[username]/[slug]`)
- No public-facing component to render pages
- No publish/unpublish system

❌ **Page Management**
- Dashboard shows builder directly (should show page list)
- No way to create multiple pages
- No page list/grid view
- No CRUD operations UI

❌ **Database Integration**
- Save/load methods exist in store but not connected to routes
- No page loading on builder mount
- Auto-save not triggered properly
- No save status indicator

❌ **Publishing Workflow**
- No publish toggle
- No share modal with copy link
- No public URL generation

❌ **SEO & Metadata**
- No meta title/description fields
- No Open Graph tags
- No social share preview

***

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

-- ❓ VERIFY EXISTENCE
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  page_id UUID REFERENCES pages(id),
  domain TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Profiles are public
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users update own profile
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # ❌ NEEDS UPDATE: Currently shows builder, needs page list
│   │   └── pages/                # ❌ NEW: Page-specific routes
│   │       ├── page.tsx          # ❌ NEW: List of user's pages
│   │       ├── new/
│   │       │   └── page.tsx      # ❌ NEW: Create new page flow
│   │       └── [id]/
│   │           └── page.tsx      # ❌ NEW: Builder (move current dashboard here)
│   │
│   ├── [username]/               # ❌ NEW: Public routes
│   │   └── [slug]/
│   │       └── page.tsx          # ❌ NEW: Public page view
│   │
│   └── actions/
│       ├── auth.ts               # ✅ EXISTS
│       └── pages.ts              # ✅ EXISTS but needs full CRUD
│
├── components/
│   ├── builder/                  # ✅ COMPLETE - Don't modify
│   │   ├── Canvas.tsx
│   │   ├── BlockRenderer.tsx
│   │   ├── BlockEditor.tsx
│   │   ├── ThemesSection.tsx
│   │   ├── MicroInteractionsSection.tsx
│   │   ├── AutoSaveManager.tsx
│   │   └── HeaderActions.tsx
│   │
│   ├── dashboard/                # ❌ NEW: Page management UI
│   │   ├── PagesList.tsx         # ❌ NEW: Grid/list of pages
│   │   ├── PageCard.tsx          # ❌ NEW: Individual page card
│   │   └── PageSetupForm.tsx     # ❌ NEW: Create page form
│   │
│   └── public/                   # ❌ NEW: Public viewing
│       └── PublicPageRenderer.tsx # ❌ NEW: Read-only page renderer
│
├── store/
│   └── builderStore.ts           # ✅ COMPLETE - Minor updates needed
│
├── types/
│   ├── builder.ts                # ✅ COMPLETE
│   └── database.ts               # ⚠️ NEEDS UPDATE: Add Page type with SEO
│
└── lib/
    └── themes.ts                 # ✅ COMPLETE
```

***

## 🚀 Implementation Phases

### Phase 1: Public Page Viewing (CRITICAL - MVP Blocker) 🔥

**Goal:** Users can share and view their published pages publicly.

**Why Critical:** This is the core value proposition. Without it, Linq is useless.

#### Step 1.1: Create Public Page Route

**Files to create/modify:**
- `src/app/[username]/[slug]/page.tsx` (NEW)
- `src/components/public/PublicPageRenderer.tsx` (NEW)
- `src/types/database.ts` (UPDATE)

**Implementation:**

```typescript
// src/app/[username]/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { PublicPageRenderer } from '@/components/public/PublicPageRenderer';

interface PageProps {
  params: {
    username: string;
    slug: string;
  };
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

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

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
  
  // Fetch page with profile info
  const { data: page, error } = await supabase
    .from('pages')
    .select('*, profiles!inner(username, full_name, avatar_url)')
    .eq('profiles.username', params.username)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (error || !page) {
    notFound();
  }

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
  const { blocks } = page;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with user info */}
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
              <p className="text-muted-foreground">
                @{page.profiles.username}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Blocks */}
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <p className="text-center text-muted-foreground">
              This page is empty.
            </p>
          ) : (
            blocks.map((block) => (
              <PublicBlockRenderer key={block.id} block={block} />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container max-w-4xl mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
          <p>
            Made with <a href="/" className="underline">Linq</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function PublicBlockRenderer({ block }: { block: Block }) {
  // Hybrid styling: inline for custom values
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

  // Tailwind classes for micro-interactions
  const className = cn(
    block.microInteractions.hover,
    block.microInteractions.click,
    block.microInteractions.scroll,
    'transition-all'
  );

  switch (block.type) {
    case 'heading':
      return (
        <h1 style={combinedStyles} className={className}>
          {block.content || 'Heading'}
        </h1>
      );
    case 'paragraph':
      return (
        <p style={combinedStyles} className={className}>
          {block.content || 'Paragraph'}
        </p>
