---
description: 
---

Phase 1: Public Page Viewing (MVP Critical) 🔥

Goal: Users can share and view their link-in-bio pages publicly.
Step 1.1: Create Public Page Route

Files:

    src/app/[username]/[slug]/page.tsx (NEW)

    src/components/public/PublicPageRenderer.tsx (NEW)

Tasks:

    Create dynamic route [username]/[slug]

    Fetch page data from database via slug + username

    Build PublicPageRenderer component (similar to BlockRenderer but read-only, no edit UI)

    Apply stored block styles, themes, and micro-interactions

    Add basic SEO metadata (title, description from page data)

Testing:

    Can navigate to /testuser/mypage

    Blocks render correctly with all styles applied

    No edit controls visible

    Mobile responsive

    Correct SEO tags in head

Commit: feat: add public page viewing route with read-only renderer
Step 1.2: Add Publish/Unpublish Functionality

Files:

    src/app/actions/pages.ts (VERIFY/UPDATE)

    src/components/builder/PublishToggle.tsx (NEW)

    src/store/builderStore.ts (UPDATE - add isPublished state)

Tasks:

    Add is_published boolean to page state in store

    Create PublishToggle component with switch UI

    Add publishPage() and unpublishPage() server actions

    Update RLS policies to allow public read only if is_published = true

    Add publish status indicator in builder header

Testing:

    Toggle publish status

    Unpublished page returns 404 on public route

    Published page is accessible

    Status persists after refresh

Commit: feat: add publish/unpublish toggle with RLS protection
Step 1.3: Add Share Modal with Copy Link

Files:

    src/components/builder/ShareModal.tsx (NEW)

    src/components/builder/HeaderActions.tsx (UPDATE)

Tasks:

    Create modal with generated public URL

    Add "Copy Link" button with toast confirmation

    Show share modal after publishing

    Add "Share" button to header actions

Testing:

    Click Share → modal opens with correct URL

    Copy link → copies to clipboard

    Toast confirmation appears

Commit: feat: add share modal with copy-to-clipboard functionality
Phase 2: Page Management Dashboard

Goal: Users can create, manage, and organize multiple pages.
Step 2.1: Restructure Dashboard Routes

Files:

    src/app/dashboard/page.tsx (UPDATE)

    src/app/dashboard/pages/page.tsx (NEW - list view)

    src/app/dashboard/pages/[id]/page.tsx (NEW - builder view)

    src/app/dashboard/pages/new/page.tsx (NEW - creation flow)

Tasks:

    Move current builder from /dashboard to /dashboard/pages/[id]

    Create new /dashboard landing with page list

    Add "Create New Page" button and flow

    Display list of pages with preview cards

Testing:

    Dashboard shows list of pages

    "Create New" redirects to /dashboard/pages/new

    Clicking page card opens builder at /dashboard/pages/[id]

    Back button returns to dashboard

Commit: refactor: restructure dashboard routes for page management
Step 2.2: Build PagesList Component

Files:

    src/components/dashboard/PagesList.tsx (NEW)

    src/components/dashboard/PageCard.tsx (NEW)

    src/app/actions/pages.ts (UPDATE - add list/delete actions)

Tasks:

    Fetch user's pages from database

    Display as grid of cards with preview image

    Show page title, slug, publish status, last updated

    Add quick actions: Edit, Delete, Duplicate, Publish toggle

    Add empty state with "Create First Page" CTA

Testing:

    Pages load and display correctly

    Delete confirmation modal works

    Duplicate creates copy

    Toggle publish updates status

Commit: feat: add pages list with CRUD operations
Step 2.3: New Page Creation Flow

Files:

    src/app/dashboard/pages/new/page.tsx (NEW)

    src/components/dashboard/PageSetupForm.tsx (NEW)

Tasks:

    Form to input page title and slug

    Slug validation (unique, URL-safe)

    Create page record in database

    Initialize with empty blocks array

    Redirect to builder at /dashboard/pages/[newId]

Testing:

    Form validates slug uniqueness

    Creates page record

    Redirects to builder with empty canvas

Commit: feat: add new page creation flow with slug validation
Phase 3: Database Persistence Integration

Goal: Builder properly saves/loads from database at appropriate times.
Step 3.1: Integrate Auto-Save

Files:

    src/components/builder/AutoSaveManager.tsx (VERIFY)

    src/app/dashboard/pages/[id]/page.tsx (UPDATE)

Tasks:

    Load page data from database on mount

    Call loadFromDatabase(pageId) in builder

    Verify auto-save triggers every 30 seconds

    Show "Saving..." indicator in header

    Handle save errors gracefully

Testing:

    Page loads with correct blocks

    Changes auto-save every 30s

    Manual save button works

    Save indicator shows status

Commit: feat: integrate database auto-save in builder
Step 3.2: Add Manual Save with Toast

Files:

    src/components/builder/HeaderActions.tsx (UPDATE)

Tasks:

    Add manual "Save" button

    Show toast on successful save

    Display last saved timestamp

    Handle concurrent edits (optimistic locking)

Commit: feat: add manual save button with status feedback
Phase 4: SEO & Metadata

Goal: Published pages have proper SEO for sharing.
Step 4.1: Add SEO Metadata Editor

Files:

    src/components/builder/SEOEditor.tsx (NEW)

    src/app/dashboard/pages/[id]/page.tsx (UPDATE)

    src/types/builder.ts (UPDATE - add SEO fields to Page type)

Tasks:

    Add sidebar section for SEO metadata

    Fields: Page Title, Meta Description, OG Image URL

    Preview how it looks when shared

    Store in database

    Render in <head> on public page

Testing:

    SEO fields save/load correctly

    Metadata appears in page head

    Preview shows social share card

Commit: feat: add SEO metadata editor for pages
Phase 5: Basic Analytics (Optional Enhancement)

Goal: Users see basic page performance metrics.
Step 5.1: Add Page View Tracking

Files:

    src/app/[username]/[slug]/page.tsx (UPDATE)

    src/app/api/analytics/track/route.ts (NEW)

    Database: Create page_analytics table

Tasks:

    Create analytics table (page_id, views, clicks, date)

    Track page view on public page load

    Simple API endpoint to log views

    Respect DNT (Do Not Track) headers

Testing:

    Views increment on page load

    Data stored correctly

Commit: feat: add basic page view tracking
Step 5.2: Display Analytics in Dashboard

Files:

    src/app/dashboard/analytics/page.tsx (NEW)

    src/components/dashboard/AnalyticsChart.tsx (NEW)

Tasks:

    Fetch analytics data per page

    Display views over time (last 7/30 days)

    Show total views and clicks

    Simple bar/line chart

Commit: feat: add analytics dashboard with charts
Phase 6: Domain Management (Advanced)

Goal: Users can add custom domains.
Step 6.1: Add Domain UI

Files:

    src/app/dashboard/domains/page.tsx (NEW)

    src/components/dashboard/DomainManager.tsx (NEW)

Tasks:

    Form to add custom domain

    Show verification status

    DNS instructions (CNAME record)

    Verify domain ownership via DNS challenge

Testing:

    Can add domain

    Shows verification instructions

    Status updates on verification

Commit: feat: add custom domain management UI
Step 6.2: Domain Verification API

Files:

    src/app/api/domains/verify/route.ts (NEW)

    src/app/actions/domains.ts (NEW)

Tasks:

    DNS lookup to verify CNAME

    Update domain status in database

    Show verification progress

Commit: feat: add domain verification API with DNS checks
Phase 7: Additional Block Types

Goal: More content types for richer pages.
Step 7.1: Add Button/CTA Block

Files:

    src/types/builder.ts (UPDATE)

    src/components/builder/BlockRenderer.tsx (UPDATE)

Tasks:

    Add button to BlockType

    Fields: button text, URL, style (primary/secondary/outline)

    Render with proper styling

Commit: feat: add button/CTA block type
Step 7.2: Add Divider and Spacer Blocks

Similar steps for divider and spacer blocks
🚀 EXECUTION SUMMARY FOR AI AGENTS
Implementation Order Priority:

    ✅ Phase 1 (Critical) - Public page viewing (3 steps)

    ✅ Phase 2 (High) - Page management dashboard (3 steps)

    ✅ Phase 3 (High) - Database integration (2 steps)

    ⭐ Phase 4 (Medium) - SEO metadata (1 step)

    📊 Phase 5 (Optional) - Analytics (2 steps)

    🌐 Phase 6 (Advanced) - Custom domains (2 steps)

    🎨 Phase 7 (Polish) - Additional blocks (2+ steps)

Per-Step Agent Protocol:

Each step follows this structure:

    Announce: "Implementing Phase X, Step X.Y: [Description]"

    Files to modify: List exact file paths

    Code: Provide complete, copy-paste ready code

    Explanation: ELI5 what the code does

    Testing: Provide 3 tests (console, visual, persistence)

    Commit: Exact commit message
