# Project Context — Linq

This file gives a concise, developer-focused overview of the repository, how to run it locally, where the important bits live, and a few common gotchas.

## What this is

Linq is a small Next.js (App Router) TypeScript project built with shadcn components and Supabase for auth/storage. The app provides user-auth, a dashboard, and a block-based editor for building simple micro-pages with optional custom domain mapping.

Key points:
- Next.js App Router + TypeScript
- UI: shadcn + Tailwind CSS
- Auth & DB: Supabase (Postgres + Auth + RLS)
- **Security: Rate limiting with Upstash Redis**
- **OAuth: Google authentication**

## Quick start (local)

Requirements: Node.js (18+), a Supabase project for local testing, Upstash Redis account (free tier), and your preferred package manager.

1. Install deps

```bash
npm install
```

2. Create a `.env.local` with the required keys (see below).

3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

## Important environment variables

At minimum add these to `.env.local`:

### Supabase (Required)
- `NEXT_PUBLIC_SUPABASE_URL`=your-supabase-url
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`=your-anon-key
- `SUPABASE_SERVICE_ROLE_KEY`=your-service-role-key (only on server side / CI)

### Upstash Redis (Required for rate limiting)
- `UPSTASH_REDIS_REST_URL`=https://your-redis.upstash.io
- `UPSTASH_REDIS_REST_TOKEN`=your-upstash-token

### App Configuration (Required for OAuth)
- `NEXT_PUBLIC_SITE_URL`=http://localhost:3000

**Important:** Keep secret keys out of the client and do not commit `.env.local`.

## Folder layout (important parts)

```
src/
  app/
    globals.css        — Tailwind globals and base styles
    layout.tsx         — root layout (where providers, theme, html classes live)
    page.tsx           — landing page that composes components

    api/                — server API routes (`route.ts` files)
      admin/
      protected/
      auth/
        signup/
          route.ts      — ⭐ Secure signup API with rate limiting

    auth/
      confirm/          — auth confirm route
      callback/
        route.ts        — ⭐ NEW: OAuth callback handler

    actions/
      auth.ts           — ⭐ NEW: Server actions for Google OAuth

    dashboard/          — ⭐ UPDATED: Protected dashboard with builder interface
      page.tsx          — Canvas + PropertiesPanel layout
    forgot-password/    — forgot-password page
    login/              — login page + actions
    signup/             — signup page + actions

  components/
    ui/                 — presentational components (shadcn-derived)
      navbar1.tsx
      hero1.tsx          — hero component (may require props; see below)
      login-form.tsx     — ⭐ UPDATED: Supports Google OAuth
      signup-form.tsx    — ⭐ UPDATED: Supports Google OAuth
      forgotPasswordForm.tsx
      textarea.tsx       — ⭐ NEW: Textarea component for block editor
      ...other components

    builder/            — ⭐ NEW: Block-based page builder components
      Canvas.tsx        — Main canvas component (orchestrator)
      BlockRenderer.tsx — Read-only block rendering with selection
      AddBlockButton.tsx — Block creation UI
      PropertiesPanel.tsx — Block editing sidebar

  lib/
    utils.ts            — shared helpers
    rate-limit.ts       — ⭐ Rate limiting configuration with Upstash

  store/                — ⭐ NEW: State management
    builderStore.ts     — Zustand store with localStorage persistence

  types/                — ⭐ NEW: TypeScript type definitions
    builder.ts          — Block, theme, and history types

  utils/supabase/
    client.ts           — supabase client factory (use client for browser)
    server.ts           — server-side supabase helpers
    middleware.ts       — supabase-related middleware helpers
```


Top-level files: `middleware.ts`, `next.config.ts`, `package.json`, `tsconfig.json`.

## Form UX Features

### Overview
Authentication forms (login and signup) implement comprehensive UX improvements including real-time validation, loading states, and micro-interactions for a professional user experience.

### Error Handling

#### Field-Level Validation
- **Real-time validation**: Validates on blur (when user leaves field)
- **Progressive validation**: Errors only show after field is touched
- **User-friendly messages**: Technical errors converted to actionable guidance
  - Example: "Invalid login credentials" → "The email or password you entered is incorrect. Please try again."
- **Visual indicators**: 
  - Red border on invalid fields
  - AlertCircle icons next to error messages
  - Color-coded text (red for errors, green for success)

#### Validation Rules
**Email:**
- Required field
- Must match format: `example@domain.com`
- Validates on blur and updates on change if touched

**Password:**
- Required field
- Minimum 6 characters
- Must contain both letters AND numbers
- Pattern: `/(?=.*[a-zA-Z])(?=.*[0-9])/`

#### Error Message Placement
- Field errors: Directly below the problematic input
- Global errors: At top of form (e.g., auth failures, network errors)
- Rate limit errors: Include countdown timer showing retry availability

### Loading States

#### Button States
- **Login/Signup buttons**: Text changes to "Logging in..." / "Creating Account..." with spinner
- **Google OAuth button**: Shows "Signing in..." with spinner
- **Disabled states**: All interactive elements disabled during async operations
- **Visual loading indicators**: Loader2 icon from lucide-react with spin animation

#### State Management
```tsx
const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);
```
- Separate loading states for email and OAuth flows
- Form inputs disabled when any loading state is active
- Prevents duplicate submissions

### Micro-interactions

#### Animations (Tailwind v4)
Defined in `src/app/globals.css` using Tailwind v4 syntax:

```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-shake: shake 0.5s ease-in-out;
}

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}
```

Usage: `className="animate-shake"` or `className="animate-fade-in"`

#### Interaction Effects
- **Shake animation**: Form card shakes on validation errors (0.5s)
- **Fade-in effects**: Error/success messages smoothly appear (0.3s)
- **Button hover**: Scale up to 1.02x (`hover:scale-[1.02]`)
- **Button press**: Scale down to 0.98x (`active:scale-[0.98]`)
- **Focus rings**: Enhanced 2px ring with offset for keyboard navigation
- **Smooth transitions**: 200ms duration on all state changes (`transition-all duration-200`)

### Password Strength Indicator (Signup Only)

#### Strength Levels
- **Weak** (red): Less than 6 chars OR missing letters/numbers
- **Medium** (yellow): 6-9 chars with both letters and numbers
- **Strong** (green): 10+ chars with both letters and numbers

#### Visual Feedback
- 3-bar progress indicator with color transitions
- Real-time updates as user types
- Contextual hint text based on strength level
- Uses `watch('password')` from react-hook-form for reactivity

```tsx
useEffect(() => {
  if (password) {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasBoth = hasLetters && hasNumbers;
    
    if (password.length < 6 || !hasBoth) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }
}, [password]);
```

### React Hook Form Integration

#### Registration Pattern
Event handlers integrated with `register()` to avoid conflicts:

```tsx
<Input
  {...register('email', {
    onBlur: handleEmailBlur,
    onChange: handleEmailChange
  })}
/>
```

#### Value Retrieval
Use `getValues()` instead of event targets to avoid timing issues:

```tsx
const handleEmailBlur = () => {
  const email = getValues('email');
  const emailError = validateEmail(email);
  // ...
};
```

#### Touched State Tracking
```tsx
const [touched, setTouched] = useState({email: false, password: false});
```
- Tracks which fields user has interacted with
- Errors only show after field is touched (blur event)
- Progressive validation: updates on change after first blur

### Accessibility Features

- **ARIA labels**: Password visibility toggle buttons have descriptive labels
  ```tsx
  aria-label={showPassword ? "Hide password" : "Show password"}
  ```
- **Keyboard navigation**: All interactive elements accessible via Tab
- **Focus management**: Enhanced focus rings for visibility
- **Screen reader support**: Error messages announced when they appear
- **Disabled state styling**: Visual feedback when form is submitting

### Rate Limiting Handling

For signup form with Upstash rate limiting:

```tsx
const [retryAfter, setRetryAfter] = useState<number | null>(null);

useEffect(() => {
  if (retryAfter && retryAfter > 0) {
    const timer = setTimeout(() => {
      setRetryAfter(retryAfter - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [retryAfter]);
```

- Shows countdown timer when rate limited
- Disables submit button during countdown
- Error message includes "Retry in X seconds"
- Clears error when countdown reaches 0

### File Locations

- **Login Form**: `src/components/ui/login-form.tsx`
- **Signup Form**: `src/components/ui/signup-form.tsx`
- **Animations**: `src/app/globals.css` (Tailwind v4 `@theme` and `@keyframes`)
- **Form Actions**: `src/app/actions/auth.ts` (Google OAuth)
- **API Routes**: `src/app/api/auth/signup/route.ts` (Email signup with rate limiting)

### Dependencies

- `react-hook-form`: Form state management and validation
- `lucide-react`: Icons (Loader2, AlertCircle, CheckCircle2, Eye, EyeOff)
- `@supabase/supabase-js`: Authentication
- Tailwind CSS v4: Styling and animations

### Testing Checklist

- [ ] Type invalid email → blur → see error + shake
- [ ] Type valid email → error disappears immediately
- [ ] Type password without numbers → blur → see error
- [ ] Type password with letters and numbers → strength indicator updates
- [ ] Submit form with valid data → see loading state
- [ ] Submit form with invalid data → see shake animation
- [ ] Click Google sign in → see separate loading state
- [ ] Tab through form → focus states visible
- [ ] Hover over buttons → see scale effect
- [ ] Click buttons → see press effect
- [ ] Trigger rate limit → see countdown timer

## Google OAuth Setup

### Files Added:
1. **`src/app/auth/callback/route.ts`** - Handles OAuth callback from Google
2. **`src/app/actions/auth.ts`** - Server action for `signInWithGoogle()`

### Configuration Required:

**Google Cloud Console:**
1. Create OAuth 2.0 credentials
2. Authorized redirect URI: Get from Supabase Dashboard → Authentication → Providers → Google
3. Add scopes: `userinfo.email`, `userinfo.profile`, `openid`

**Supabase Dashboard:**
1. Enable Google provider in Authentication → Providers
2. Add Google Client ID and Secret
3. Copy callback URL for Google Cloud setup

**Environment Variable:**
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production Deployment:
- Add production URL to Google Cloud Console authorized URIs
- Update `NEXT_PUBLIC_SITE_URL` in production environment
- Update Supabase Site URL and Redirect URLs in dashboard

## Security Features

### Rate Limiting (Anti-Abuse Protection)

**Location:** `src/lib/rate-limit.ts`

The signup flow is protected with IP-based rate limiting using Upstash Redis:

- **Current limit:** 5 attempts per 60 seconds per IP address
- **Technology:** Upstash Redis with sliding window algorithm
- **What it prevents:**
  - Automated bot attacks
  - Credential stuffing attempts
  - Email enumeration abuse
  - DoS attacks on signup endpoint

**Configuration:**

```typescript
// src/lib/rate-limit.ts
export const signupRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 attempts per minute
  analytics: true,
  prefix: "linq:signup",
});
```

**Adjusting rate limits:**

For different environments, modify the `slidingWindow` parameters:

- **Development:** `(5, "60 s")` — 5 per minute (easy testing)
- **Production (recommended):** `(10, "300 s")` — 10 per 5 minutes (balanced)
- **High security:** `(5, "900 s")` — 5 per 15 minutes (strict)

**Monitor rate limits:**
- Dashboard: https://console.upstash.com/
- Check "Commands" tab to see usage patterns
- Look for unusual spikes indicating abuse

### Secure Signup Flow (Option 1 Security)

**Location:** `src/app/api/auth/signup/route.ts`

The signup API implements industry-standard security practices:

1. **No user enumeration:** Always returns the same success message whether email exists or not
2. **Server-side validation:** All checks happen on the backend
3. **Rate limiting:** Prevents automated attacks
4. **IP tracking:** Blocks suspicious patterns

**How it works:**

```typescript
// Always shows same message (security by obscurity)
return NextResponse.json({
  message: 'Check your email for the next steps!',
  requiresEmailConfirmation: true,
}, { status: 200 });
```

**Why this matters:**
- Attackers can't discover which emails are registered
- Prevents targeted phishing attacks
- Industry best practice for authentication systems

**User behavior:**

| Scenario | What Happens | Email Sent? |
|----------|--------------|-------------|
| New user | "Check your email..." | ✓ Supabase confirmation |
| Existing user | "Check your email..." | ✗ No email (silent) |
| Rate limited | Error + countdown timer | ✗ Blocked |
| Google OAuth | Instant login/signup | ✗ Auto-verified |

## How auth & protected pages work

- The project uses Supabase Auth (client in browser + server helpers in `utils/supabase`).
- **Two authentication methods:**
  1. Email/Password: Signup uses API route (`/api/auth/signup`), login uses client
  2. Google OAuth: Uses server action (`signInWithGoogle`) and callback route
- Protected API routes live under `src/app/api/protected/route.ts` and similar.
- Session refresh / Host-based routing logic can be found in the root `middleware.ts` and `src/utils/supabase/middleware.ts`.

## Common gotchas & tips

- **Rate limit testing:** After 5 rapid signup attempts, you'll be blocked for 60 seconds. Wait or adjust the limit in `rate-limit.ts` for testing.
- **Environment variables:** Supabase, Upstash Redis, AND `NEXT_PUBLIC_SITE_URL` are required.
- **API route location:** The signup API must be at `src/app/api/auth/signup/route.ts` (note the `api` folder) or you'll get JSON parse errors.
- **OAuth callback:** Must be at `src/app/auth/callback/route.ts` (note: `auth`, not `api/auth`).
- **Google OAuth redirect:** For hosted Supabase use `http://localhost:3000/auth/callback`, for local Docker use `http://localhost:54321/auth/v1/callback`.
- Hero component props: `src/components/ui/hero1.tsx` expects props (`heading`, `description`, `image`) — either pass them from `app/page.tsx` or set defaults inside `hero1.tsx` to avoid TypeScript errors.
- React Hook Form typing: ensure you call `useForm<YourFormType>()` so `handleSubmit` returns a typed object. Example: `useForm<LoginFormData>()`.
- Type shorthand errors: when passing values to API calls, reference the fields off the function parameter (e.g. `email: data.email`) rather than using bare `email` unless it exists in scope.
- Dark mode/Tailwind: Tailwind dark mode is usually configured in `tailwind.config.js` (either `class` or `media`). If components render light/dark unexpectedly, check `layout.tsx` for `className="dark"` usage or integration with `next-themes`.

## Developer notes

- Scripts available (from `package.json`):
  - `npm run dev` — start dev server
  - `npm run build` — build for production
  - `npm start` — run production build
  - `npm run lint` — run ESLint

- Use `app/layout.tsx` to attach any global providers (theme, auth provider, supabase provider).
- Keep presentational components inside `components/ui` and small, focused.
- **New API routes** should follow the pattern in `api/auth/signup/route.ts` (rate limiting + validation + security).
- **Server actions** for auth should be in `app/actions/auth.ts` with `'use server'` directive.

## Where to change layout / navbar centering

- `src/components/ui/navbar1.tsx` controls the desktop menu. To center the nav only on desktop, set container classes like `className="container lg:flex lg:justify-center"` and make the `nav` `w-full` while keeping mobile layout untouched.

## Database & tables (high level)

- **profiles:** user profile data
- **pages:** pages created by users (slug, title, user_id)
- **blocks:** page blocks (type, content JSON, position)
- **domains:** custom domains and verification flags

RLS should be configured so users only access their own rows.

## Security Best Practices

### Rate Limiting

✅ **Do:**
- Monitor Upstash dashboard for unusual patterns
- Adjust limits based on real usage data
- Test rate limiting in development before deploying

❌ **Don't:**
- Set limits too strict (frustrates legitimate users)
- Forget to add Redis credentials to production environment
- Disable rate limiting in production

### Authentication

✅ **Do:**
- Always use the API route for signup (`/api/auth/signup`)
- Keep the same success message for new and existing users
- Validate inputs server-side
- Use server actions for OAuth flows
- Verify callback URLs match in Google Cloud Console

❌ **Don't:**
- Reveal whether an email exists in the system
- Handle signup logic in client components
- Skip rate limiting for "convenience"
- Commit OAuth credentials to git

---

## Builder System

The builder is a block-based page editor that allows users to create micro-pages by adding, styling, and arranging blocks. Implementation follows a micro-step approach with strict separation of concerns.

### Core Principles

1. **State Management**: Zustand with localStorage persistence
   - All builder state lives in `src/store/builderStore.ts`
   - Avoid local React state (`useState`) for blocks
   - Automatic persistence to `localStorage` with the key `linq-builder-storage`

2. **Hybrid Styling System**:
   - **Inline styles** for user-customizable values (fontSize, color, backgroundColor, padding, margin, borders)
   - **Tailwind classes** for micro-interactions (hover, click, scroll animations)
   - Never mix these two approaches for the same property

3. **Type Safety**:
   - All types defined in `src/types/builder.ts`
   - No `any` types allowed
   - Block types: `heading`, `paragraph`, `image`, `link`

### Component Architecture

**Canvas** (`src/components/builder/Canvas.tsx`)
- Orchestrator component that renders the list of blocks
- Handles background click to deselect blocks
- Fetches blocks from Zustand store
- Displays `AddBlockButton` at the bottom

**BlockRenderer** (`src/components/builder/BlockRenderer.tsx`)
- Read-only component that renders individual blocks
- Applies inline styles from block.styles
- Applies Tailwind classes from block.microInteractions
- Handles click events for selection (with visual ring indicator)
- Uses `e.stopPropagation()` to prevent canvas deselection

**AddBlockButton** (`src/components/builder/AddBlockButton.tsx`)
- Dropdown menu to create new blocks
- Generates unique IDs with `crypto.randomUUID()`
- Initializes blocks with proper position, themeLocked, and microInteractionsLocked properties

**PropertiesPanel** (`src/components/builder/PropertiesPanel.tsx`)
- Write-only sidebar for editing selected blocks
- Organized sections: Reorder, Content, Typography, Colors, Spacing, Borders
- Includes delete button and move up/down actions

### Store Actions

```typescript
// Block CRUD
addBlock(block: Block)
updateBlock(id: string, updates: Partial<Block>)
deleteBlock(id: string)

// Selection
selectBlock(id: string | null)

// Reordering
moveBlockUp(id: string)
moveBlockDown(id: string)
```

### Current Features (Phase 0-6)

- ✅ Block creation (Heading, Paragraph, Image, Link)
- ✅ Block selection with visual indicators
- ✅ Content editing (text input / textarea)
- ✅ Typography controls (font family, weight, size)
- ✅ Color controls (text & background)
- ✅ Spacing controls (margin & padding)
- ✅ Border controls (width, radius, color)
- ✅ Block reordering (move up/down)
- ✅ Block deletion
- ✅ localStorage persistence

### Pending Features (Phase 7+)

- Theme system (predefined themes + per-block locking)
- Micro-interactions (hover, click, scroll animations)
- History/undo system
- Database persistence (save to Supabase)
- Export functionality (HTML/JSON)

---

## Deployment Checklist

When deploying to production (Vercel):

1. ✅ Add all environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` (set to production URL)

2. ✅ Verify rate limiting works:
   - Test signup 6+ times rapidly
   - Should see rate limit error

3. ✅ Check Upstash free tier limits:
   - 10,000 commands/day
   - Monitor usage in dashboard

4. ✅ Enable email confirmations in Supabase:
   - Dashboard → Authentication → Email Templates
   - Ensure confirmation emails are enabled

5. ✅ Add production URLs to Google Cloud Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: Get from Supabase Dashboard

6. ✅ Update Supabase URL Configuration:
   - Dashboard → Authentication → URL Configuration
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: Add `https://yourdomain.com/**`

## Troubleshooting

### "JSON.parse error" on signup
**Cause:** API route doesn't exist or is in wrong location  
**Fix:** Verify file is at `src/app/api/auth/signup/route.ts` (not `app/auth/signup`)

### Rate limiting not working
**Cause:** Missing Redis credentials  
**Fix:** Check `.env.local` has both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### "Too many signup attempts" appearing immediately
**Cause:** Rate limit set too strict or Redis cache from previous tests  
**Fix:** Increase limit in `rate-limit.ts` or wait for window to expire

### Signup succeeds but no email
**Cause:** Email confirmations disabled in Supabase  
**Fix:** Supabase Dashboard → Authentication → Settings → Enable confirmations

### "Redirect URI mismatch" error (OAuth)
**Cause:** Callback URL in Google Cloud doesn't match Supabase  
**Fix:** Copy exact URL from Supabase Dashboard → Authentication → Providers → Google

### Google button does nothing
**Cause:** Server action not found or NEXT_PUBLIC_SITE_URL missing  
**Fix:** Verify `src/app/actions/auth.ts` exists and check `.env.local`

### OAuth redirects but user not logged in
**Cause:** Callback route not handling code exchange  
**Fix:** Check `src/app/auth/callback/route.ts` exists and logs

## Next steps / TODO ideas

- ✅ ~~Implement secure signup with rate limiting~~ (DONE)
- ✅ ~~Add Google OAuth for login and signup~~ (DONE)
- ✅ ~~Implement block-based page builder (Phase 0-6)~~ (DONE)
- Add rate limiting to login endpoint
- Add rate limiting to password reset
- Continue builder implementation (Phase 7+: Themes, Micro-interactions, etc.)
- Add drag-n-drop block reordering
- Harden domain verification; add background verification checks
- Add tests for key server actions and API routes
- Set up monitoring/alerts for rate limit abuse
- Consider adding CAPTCHA for additional bot protection

---

**Recent Updates:**

### Builder System Implementation (Phase 0-6)
- **Phase 0 - Foundation**: Set up Zustand state management, Sonner toasts, and TypeScript types for blocks
- **Phase 1 - Store Setup**: Created Zustand store with localStorage persistence, block CRUD actions, and selection state
- **Phase 2 - Canvas & Rendering**: Built Canvas component, BlockRenderer with hybrid styling (inline + Tailwind), integrated into dashboard
- **Phase 3 - Block Management**: Added block creation (Heading, Paragraph, Image, Link), selection with visual indicators, canvas deselection
- **Phase 4 - Properties Panel**: Created editing sidebar with content and basic style controls (font size, colors, padding)
- **Phase 5 - Deletion & Reordering**: Added delete block, move up/down with smart boundary detection
- **Phase 6 - Advanced Styling**: Enhanced PropertiesPanel with typography (font family, weight), spacing (margin/padding), and border controls

**Builder Architecture:**
- **State Management**: Zustand with persist middleware (localStorage)
- **Hybrid Styling**: Inline styles for user-customizable values, Tailwind classes for micro-interactions
- **Component Separation**: Canvas (orchestrator), BlockRenderer (read-only), PropertiesPanel (write-only)
- **Type Safety**: Strict TypeScript types in `src/types/builder.ts`

### Authentication & Security
- Added Google OAuth authentication (login + signup)
- Created OAuth callback handler and server action
- Updated login/signup forms with OAuth support
- Added rate limiting with Upstash Redis (5 attempts/60s)
- Implemented secure signup API route (no user enumeration)

---