# LINQ Builder - Agent Instructions

> **For use with:** Antigravity by Google (or similar coding agents)
> **Project:** Linq - Minimalist Link-in-Bio Page Builder
> **Last Updated:** November 29, 2025

---

## 🎯 Project Overview

**Linq** is a Next.js 16-based link-in-bio page builder with a block-based visual editor. Users can create, customize, and publish micro-pages (similar to Linktree) with drag-n-drop blocks, theme customization, and optional custom domains.

**Core Technologies:**
- **Framework:** Next.js 16 (App Router) + TypeScript 5
- **Styling:** Tailwind CSS v4
- **Component Library:** shadcn/ui components (based on Radix UI primitives)
- **State Management:** Zustand with localStorage persistence
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Authentication:** Supabase Auth (Email/Password + Google OAuth)
- **Rate Limiting:** Upstash Redis
- **Forms:** React Hook Form + Zod validation

---

## 📁 Project Structure

linq/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── [username]/[slug]/        # Public page route (SSG)
│   │   ├── actions/                  # Server actions (auth, pages)
│   │   ├── api/                      # API routes
│   │   │   ├── auth/signup/          # Secure signup with rate limiting
│   │   │   ├── admin/                # Admin endpoints
│   │   │   └── protected/            # Protected API routes
│   │   ├── auth/
│   │   │   ├── callback/             # OAuth callback handler
│   │   │   └── confirm/              # Email confirmation route
│   │   ├── dashboard/                # Protected dashboard (builder UI)
│   │   ├── login/                    # Login page
│   │   ├── signup/                   # Signup page
│   │   ├── forgot-password/          # Password reset
│   │   ├── globals.css               # Tailwind v4 + animations
│   │   └── layout.tsx                # Root layout (theme provider)
│   │
│   ├── components/
│   │   ├── builder/                  # 🏗️ Builder-specific components
│   │   │   ├── Canvas.tsx            # Main canvas (block orchestrator)
│   │   │   ├── BlockRenderer.tsx     # Read-only block display
│   │   │   ├── AddBlockButton.tsx    # Block creation dropdown
│   │   │   ├── PropertiesPanel.tsx   # Block editing sidebar
│   │   │   ├── ThemesSection.tsx     # Global theme picker
│   │   │   ├── HeaderActions.tsx     # Save, Undo, Redo buttons
│   │   │   └── AutoSaveManager.tsx   # Background auto-save (30s)
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── PagesList.tsx         # List of user pages
│   │   │   └── PageCard.tsx          # Individual page card
│   │   ├── public/                   # Public page components
│   │   │   └── PublicPageRenderer.tsx # Read-only public page view
│   │   └── ui/                       # shadcn/ui components
│   │       ├── login-form.tsx        # Login form (OAuth + email)
│   │       ├── signup-form.tsx       # Signup form (OAuth + email)
│   │       └── ...                   # Other shadcn components
│   │
│   ├── store/
│   │   └── builderStore.ts           # 🏪 Zustand store (single source of truth)
│   │
│   ├── types/
│   │   └── builder.ts                # TypeScript types (Block, GlobalTheme, etc.)
│   │
│   ├── lib/
│   │   ├── utils.ts                  # Shared helpers (cn, etc.)
│   │   └── rate-limit.ts             # Upstash rate limiter config
│   │
│   ├── utils/supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server Supabase helpers
│   │   └── middleware.ts             # Auth middleware helpers
│   │
│   └── middleware.ts                 # Root middleware (auth + routing)
│
├── .agent/                           # Agent configuration files
├── Context.md                        # 📖 Main developer context (READ THIS)
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
└── README.md                         # Project README


---

## 🧠 Core Architectural Principles

### 1. **State Management: Zustand First**
- **All builder state** lives in `src/store/builderStore.ts`
- **Avoid `useState` for blocks** - always use store actions
- **localStorage persistence** with key `linq-builder-storage`
- **History tracking** for undo/redo (10 states max)

// ✅ CORRECT - Use Zustand store
const { blocks, addBlock, updateBlock } = useBuilderStore();

// ❌ WRONG - Don't use local state for blocks
const [blocks, setBlocks] = useState<Block[]>([]);

### 2. **Hybrid Styling System**
- **Inline styles** (`style={{}}`) for user-customizable properties:
  - `fontSize`, `color`, `backgroundColor`
  - `padding`, `margin`, `border`, `borderRadius`
- **Tailwind classes** for micro-interactions only:
  - Hover effects (`hover:scale-105`)
  - Click animations (`active:scale-95`)
  - Scroll animations (`animate-fade-in`)

// ✅ CORRECT - Hybrid approach
<div
  style={{
    fontSize: block.styles.fontSize,
    color: block.styles.color,
    padding: block.styles.padding,
  }}
  className={`${block.microInteractions.hover} ${block.microInteractions.click}`}
>
  {block.content}
</div>

// ❌ WRONG - Mixing concerns
<div className="text-lg text-blue-500 p-4">  {/* Don't use Tailwind for user styles */}

### 3. **Type Safety: No `any` Allowed**
- All types defined in `src/types/builder.ts`
- Use proper TypeScript types for all props and state
- Avoid type assertions unless absolutely necessary

// ✅ CORRECT
const updateBlock = (id: string, updates: Partial<Block>) => { ... }

// ❌ WRONG
const updateBlock = (id: any, updates: any) => { ... }

### 4. **Component Separation of Concerns**

| Component | Responsibility | Reads State | Writes State |
|-----------|---------------|-------------|--------------|
| **Canvas** | Orchestrates block list | ✅ Yes | ❌ No |
| **BlockRenderer** | Displays individual blocks | ✅ Yes | ❌ No |
| **PropertiesPanel** | Edits selected block | ✅ Yes | ✅ Yes |
| **AddBlockButton** | Creates new blocks | ❌ No | ✅ Yes |

### 5. **Dual Lock System**
Each block has two independent locks:
- **`themeLocked`**: Prevents global theme changes from affecting this block
- **`microInteractionsLocked`**: Prevents global interaction changes from affecting this block

Users can lock individual blocks to preserve custom styling while applying global changes to others.

---

## 🔐 Security Best Practices

### Rate Limiting (Upstash Redis)
**Location:** `src/lib/rate-limit.ts`

// Current configuration: 5 attempts per 60 seconds per IP
export const signupRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "linq:signup",
});

**⚠️ Important Security Rules:**
1. **Never reveal if email exists** - Always return same success message
2. **Apply rate limiting to all auth endpoints** (signup, login, password reset)
3. **Use server-side validation** - Never trust client input
4. **Sanitize user input** before displaying in public pages

### Authentication Flow
- **Email/Password:** Uses API route (`/api/auth/signup`) with rate limiting
- **Google OAuth:** Uses server action (`signInWithGoogle`) + callback route
- **Session Management:** Supabase Auth with middleware protection
- **Protected Routes:** `/dashboard/*` requires authentication

---

## 🏗️ Builder System Implementation Guide

### Block Types
type BlockType = 'heading' | 'paragraph' | 'image' | 'link';

interface Block {
  id: string;                    // UUID
  type: BlockType;
  content: string;               // Text content or URL
  position: number;              // Render order
  styles: BlockStyles;           // Inline styles object
  microInteractions: MicroInteractions; // Tailwind classes
  themeLocked: boolean;          // Lock from global theme changes
  microInteractionsLocked: boolean; // Lock from global interaction changes
}

### Store Actions (Zustand)
// Block CRUD
addBlock(block: Block)                          // Create new block
updateBlock(id: string, updates: Partial<Block>) // Update existing block
deleteBlock(id: string)                         // Remove block

// Selection
selectBlock(id: string | null)                  // Select block for editing

// Reordering
moveBlockUp(id: string)                         // Move block up in list
moveBlockDown(id: string)                       // Move block down in list

// Themes
updateGlobalTheme(theme: GlobalTheme)           // Update current theme
applyGlobalTheme(theme: GlobalTheme)            // Apply to all unlocked blocks

// History
undo()                                          // Revert to previous state
redo()                                          // Restore next state

// Database
saveToDatabase(title?: string, slug?: string)   // Persist to Supabase
loadFromDatabase(pageId: string)                // Load from Supabase
setCurrentPageId(id: string | null)             // Track current page
setPageTitle(title: string)                     // Update page title

### Event Handling Pattern
// ✅ CORRECT - Use stopPropagation to prevent parent handlers
const BlockRenderer = ({ block }: { block: Block }) => {
  const { selectBlock } = useBuilderStore();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas deselection
    selectBlock(block.id);
  };
  
  return <div onClick={handleClick}>{block.content}</div>;
};

---

## 🛠️ Development Workflow

### When Adding a New Feature

1. **Check Context.md** - Read relevant sections first
2. **Update Types** - Add/modify types in `src/types/builder.ts`
3. **Update Store** - Add actions to `src/store/builderStore.ts`
4. **Create/Update Components** - Follow separation of concerns
5. **Test Thoroughly** - Console logs, visual checks, persistence checks
6. **Update Context.md** - Document new features/gotchas
7. **Commit with Clear Message** - Follow semantic commit format

### Commit Message Format
feat: add new block type for video embeds
fix: prevent canvas deselection on properties panel click
refactor: extract theme logic into separate utility
docs: update Context.md with new builder features

---

## 🚨 Common Gotchas & Solutions

### 1. **Rate Limiting During Testing**
**Problem:** After 5 rapid signup attempts, you're blocked for 60 seconds.
**Solution:** Either wait or temporarily increase limit in `rate-limit.ts`:
limiter: Ratelimit.slidingWindow(100, "60 s"), // Relaxed for testing

### 2. **localStorage Persistence Issues**
**Problem:** State not persisting between reloads.
**Solution:** Check browser console for localStorage errors. Clear `linq-builder-storage` key if corrupted:
localStorage.removeItem('linq-builder-storage');

### 3. **Canvas Deselection Not Working**
**Problem:** Clicking canvas background doesn't deselect block.
**Solution:** Ensure BlockRenderer uses `e.stopPropagation()` to prevent event bubbling.

### 4. **Global Theme Not Applying**
**Problem:** Theme changes don't affect all blocks.
**Solution:** Check if blocks have `themeLocked: true`. Unlock via Properties Panel toggle.

### 5. **OAuth Redirect URI Mismatch**
**Problem:** Google OAuth fails with redirect error.
**Solution:** Copy exact callback URL from Supabase Dashboard → Authentication → Providers → Google.

### 6. **404 on Public Pages**
**Problem:** `/[username]/[slug]` returns 404.
**Solution:** 
- Ensure page is published (`is_published = true`)
- Verify `profiles` table has `username` populated
- Check RLS policies allow public read access

### 7. **"Schema must be one of the following: api"**
**Problem:** Supabase queries fail on `linq_db` schema.
**Solution:** Go to Supabase Settings → API → Exposed schemas and add `linq_db`.

---

## 📋 Phase-by-Phase Implementation Checklist

### ✅ Phase 0-10: Completed
- [x] Foundation setup (Zustand, Sonner, TypeScript types)
- [x] Store setup with localStorage persistence
- [x] Canvas & BlockRenderer with hybrid styling
- [x] Block creation (Heading, Paragraph, Image, Link)
- [x] Properties Panel (content, styles, typography)
- [x] Block deletion & reordering
- [x] Advanced styling (spacing, borders)
- [x] Global theme system with per-block locking
- [x] Micro-interactions with per-block locking
- [x] Undo/Redo with keyboard shortcuts
- [x] Database persistence (save/load + auto-save)
- [x] Public page viewing (`/[username]/[slug]`)
- [x] Page management dashboard (list, create, delete)

### 🚧 Phase 11+: Pending Features
- [ ] Export functionality (HTML/JSON download)
- [ ] Analytics dashboard (page views, link clicks)
- [ ] Custom domain mapping (verification + DNS)
- [ ] Drag-n-drop block reordering (DnD Kit)
- [ ] Additional block types (video, social embed, button/CTA)
- [ ] SEO metadata editor per page
- [ ] Mobile responsive editing mode
- [ ] Collaboration features (share edit access)

---

## 🎨 Design System

### Colors (Tailwind v4)
Use design system colors from `globals.css`:
- Primary: `text-primary`, `bg-primary`
- Secondary: `text-secondary`, `bg-secondary`
- Accent: `text-accent`, `bg-accent`

### Animations (Tailwind v4)
Defined in `src/app/globals.css`:
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-shake: shake 0.5s ease-in-out;
}
Usage: `className="animate-fade-in"` or `className="animate-shake"`

### shadcn/ui Components
- Located in `src/components/ui/`
- Follow shadcn conventions (no modifications to base components)
- Use composition for custom behavior

---

## 🔍 Debugging Checklist

When something breaks, check these in order:

1. **Console Errors** - Check browser console first
2. **Network Tab** - Verify API calls are successful
3. **Zustand DevTools** - Install Redux DevTools to inspect store state
4. **localStorage** - Check `linq-builder-storage` key in Application tab
5. **Supabase Logs** - Check Dashboard → Logs for database errors
6. **Environment Variables** - Verify all required vars in `.env.local`
7. **Rate Limiting** - Check Upstash console for rate limit status

---

## 📖 Required Reading Before Coding

1. **Read `Context.md`** - Main developer documentation (this file references it constantly)
2. **Review `src/types/builder.ts`** - Understand all TypeScript types
3. **Study `src/store/builderStore.ts`** - Learn state management patterns
4. **Check Security Best Practices** (Section above)

---

## 🚀 Quick Start Commands

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint

**Environment Variables Required:**
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

---

## 🤖 Agent-Specific Instructions

### For Antigravity by Google:

1. **Always reference Context.md first** - It contains the most up-to-date technical details
2. **Follow micro-step approach** - Break large features into small, testable steps
3. **Announce before implementing** - State phase, step, and files to modify
4. **Provide complete code** - No placeholders, no TODOs, no `// ... rest of code`
5. **Explain after implementing** - ELI5 what the code does and why
6. **Include tests** - Provide 3 verification methods (console, visual, persistence)
7. **Use semantic commits** - Follow format: `type: description`

### Testing Protocol Per Step:
**Testing:**
1. Console: Verify no errors in browser console
2. Visual: Check UI renders correctly with proper styling
3. Persistence: Refresh page and verify state is maintained

**Acceptance Criteria:**
- [ ] All TypeScript types compile without errors
- [ ] No console warnings or errors
- [ ] UI matches design system conventions
- [ ] State persists across reloads
- [ ] No performance regressions

---

## 📚 External Documentation Links

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [React Hook Form Docs](https://react-hook-form.com/)

---

## ⚠️ Critical Reminders

1. **Never commit `.env.local`** - Keep secrets out of version control
2. **Always use TypeScript** - No JavaScript files (except config files)
3. **Follow hybrid styling system** - Inline for user styles, Tailwind for interactions
4. **No `any` types** - Maintain strict type safety
5. **Use Zustand for state** - Avoid `useState` for builder blocks
6. **Test rate limiting** - Ensure security features work before deploying
7. **Update Context.md** - Document new features and gotchas immediately

---

## 🎯 Summary for AI Agents

**You are working on Linq, a Next.js 16 link-in-bio builder.**

**Key Facts:**
- State lives in Zustand (`src/store/builderStore.ts`)
- Styling is hybrid (inline for user values, Tailwind for interactions)
- Security uses Upstash rate limiting + Supabase RLS
- Builder has dual lock system (theme + micro-interactions)
- Public pages at `/[username]/[slug]` with SSG

**Before every change:**
1. Read relevant section in `Context.md`
2. Check existing types in `src/types/builder.ts`
3. Review store actions in `src/store/builderStore.ts`
4. Follow component separation patterns

**After every change:**
1. Verify TypeScript compiles
2. Test in browser (console, visual, persistence)
3. Update `Context.md` if needed
4. Commit with semantic message

**Remember:** This is a production application used by real users. Prioritize security, type safety, and user experience in every decision.

---

**END OF INSTRUCTIONS**
