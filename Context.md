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

    dashboard/          — protected dashboard page
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
      ...other components

  lib/
    utils.ts            — shared helpers
    rate-limit.ts       — ⭐ Rate limiting configuration with Upstash

  utils/supabase/
    client.ts           — supabase client factory (use client for browser)
    server.ts           — server-side supabase helpers
    middleware.ts       — supabase-related middleware helpers
```

Top-level files: `middleware.ts`, `next.config.ts`, `package.json`, `tsconfig.json`.

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
- Mix up hosted vs local Supabase callback URLs

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
- Add rate limiting to login endpoint
- Add rate limiting to password reset
- Add Apple OAuth
- Finish block editor & drag-n-drop persistence
- Harden domain verification; add background verification checks
- Add tests for key server actions and API routes
- Set up monitoring/alerts for rate limit abuse
- Consider adding CAPTCHA for additional bot protection

---

**Recent Updates:**
- Added Google OAuth authentication (login + signup)
- Created OAuth callback handler and server action
- Updated login/signup forms with OAuth support
- Added rate limiting with Upstash Redis (5 attempts/60s)
- Implemented secure signup API route (no user enumeration)

---