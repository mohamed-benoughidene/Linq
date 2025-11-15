 # Project Context — Linq

 This file gives a concise, developer-focused overview of the repository, how to run it locally, where the important bits live, and a few common gotchas.

 ## What this is

 Linq is a small Next.js (App Router) TypeScript project built with shadcn components and Supabase for auth/storage. The app provides user-auth, a dashboard, and a block-based editor for building simple micro-pages with optional custom domain mapping.

 Key points:
 - Next.js App Router + TypeScript
 - UI: shadcn + Tailwind CSS
 - Auth & DB: Supabase (Postgres + Auth + RLS)

 ## Quick start (local)

 Requirements: Node.js (18+), a Supabase project for local testing, and your preferred package manager.

 1. Install deps

 ```bash
 npm install
 ```

 2. Create a `.env.local` with the required Supabase keys (example below).

 3. Run dev server

 ```bash
 npm run dev
 ```

 Open http://localhost:3000

 ## Important environment variables

 At minimum add these to `.env.local`:

 - NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
 - NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (only on server side / CI)

 Keep secret keys out of the client and do not commit `.env.local`.

 ## Folder layout (important parts)

 src/
   app/
     globals.css        — Tailwind globals and base styles
     layout.tsx         — root layout (where providers, theme, html classes live)
     page.tsx           — landing page that composes components

     api/                — server API routes (`route.ts` files)
       admin/
       protected/

     auth/
       confirm/          — auth confirm route

     dashboard/          — protected dashboard page
     forgot-password/    — forgot-password page
     login/              — login page + actions
     signup/             — signup page + actions

   components/
     ui/                 — presentational components (shadcn-derived)
       navbar1.tsx
       hero1.tsx          — hero component (may require props; see below)
       login-form.tsx     — typed react-hook-form component
       forgotPasswordForm.tsx
       ...other components

   lib/
     utils.ts            — shared helpers

   utils/supabase/
     client.ts           — supabase client factory (use client for browser)
     server.ts           — server-side supabase helpers
     middleware.ts       — supabase-related middleware helpers

 Top-level files: `middleware.ts`, `next.config.ts`, `package.json`, `tsconfig.json`.

 ## How auth & protected pages work

 - The project uses Supabase Auth (client in browser + server helpers in `utils/supabase`).
 - Protected API routes live under `src/app/api/protected/route.ts` and similar.
 - Session refresh / Host-based routing logic can be found in the root `middleware.ts` and `src/utils/supabase/middleware.ts`.

 ## Common gotchas & tips

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

 ## Where to change layout / navbar centering

 - `src/components/ui/navbar1.tsx` controls the desktop menu. To center the nav only on desktop, set container classes like `className="container lg:flex lg:justify-center"` and make the `nav` `w-full` while keeping mobile layout untouched.

 ## Database & tables (high level)

 - profiles: user profile data
 - pages: pages created by users (slug, title, user_id)
 - blocks: page blocks (type, content JSON, position)
 - domains: custom domains and verification flags

 RLS should be configured so users only access their own rows.

 ## Next steps / TODO ideas

 - Finish block editor & drag-n-drop persistence
 - Harden domain verification; add background verification checks
 - Add tests for key server actions and API routes

 ---

 If you'd like, I can also:
 - add a short `README.md` with these quick-start steps,
 - add a `.env.example`, or
 - open PR-style patch with the edits (I can do that now).

 ---
Below is an adjusted `Context.md` written specifically for the folder structure you have in **src/app** (Next.js App Router + TS + shadcn + Supabase).
It matches your actual directory layout exactly and removes everything irrelevant.

---

### Context.md

#### Project Overview

Linq is a SaaS platform for building simple micro-pages.
Users add, edit, delete, and position blocks.
Each block type is fixed at creation.
The product targets creators and freelancers in underserved markets.

The MVP delivers the full editor, block management, and custom domain support.

#### Tech Stack

* **Framework:** Next.js (App Router, TypeScript)
* **UI:** shadcn/ui + custom components
* **Styling:** Tailwind CSS + globals.css
* **Backend:** Supabase (PostgreSQL, Auth, RLS)
* **Auth:** Supabase Auth (email, Google, Apple)
* **State Management:** React hooks + Server Actions
* **Deployment:** Vercel (frontend), Supabase (backend), custom middleware for routing

#### Current Directory Structure

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx

    api/
      admin/
        route.ts
      protected/
        route.ts

    auth/
      confirm/
        route.ts

    dashboard/
      page.tsx

    forgot-password/
      page.tsx

    login/
      actions.ts
      page.tsx

    signup/
      actions.ts
      page.tsx

  components/
    ui/
      accordion.tsx
      badge.tsx
      button.tsx
      card.tsx
      cta10.tsx
      faq1.tsx
      feature17.tsx
      field.tsx
      footer2.tsx
      forgotPasswordForm.tsx
      hero1.tsx
      input.tsx
      label.tsx
      login-form.tsx
      login1.tsx
      logout-button.tsx
      navbar1.tsx
      navigation-menu.tsx
      pricing4.tsx
      radio-group.tsx
      separator.tsx
      sheet.tsx
      signup-form.tsx
      signup1.tsx

  lib/
    utils.ts

  utils/
    supabase/
      client.ts
      middleware.ts
      server.ts

middleware.ts
Context.md
components.json
next.config.ts
package.json
tsconfig.json
```

The structure follows Next.js standards.
Auth pages live in `app/login`, `app/signup`, and API routes live under `app/api`.

#### Core Features (MVP)

1. Full authentication flow using Supabase (server actions).
2. Dashboard page displaying user data.
3. Block creation, editing, deletion for micro-pages.
4. Saving layout, block content, and block styling.
5. Dynamic page rendering with user slug.
6. Custom domain routing: map domain → page slug.
7. Middleware for session refresh using Supabase SSR client.

#### DNS Feature

* Users add a domain under account settings.
* System asks users to add either TXT or CNAME record.
* Verification is stored in the `domains` table.
* Middleware or an edge route checks the Host header:

  * If host matches a verified domain, render the associated page.
  * Otherwise, default to Linq's main domain.

**domains table**

| Column     | Type      | Description      |
| ---------- | --------- | ---------------- |
| id         | uuid      | Primary key      |
| user_id    | uuid      | Owner            |
| domain     | text      | Domain name      |
| verified   | boolean   | Ownership status |
| created_at | timestamp | Timestamp        |

#### Database Model (Supabase PostgreSQL)

* **profiles**: id, email, role, created_at
* **pages**: id, user_id, title, slug, created_at
* **blocks**: id, page_id, type, content (JSON), position, created_at
* **block_styles**: block_id, size, color, x_position, y_position
* **domains**: id, user_id, domain, verified, created_at

RLS policies ensure users only access their own pages, blocks, and domains.

#### Important Logic Locations

* **Auth logic:**
  `src/app/login/actions.ts`
  `src/app/signup/actions.ts`
  `src/utils/supabase/server.ts`
  `src/utils/supabase/middleware.ts`

* **Protected routes:**
  `src/app/api/protected/route.ts`
  `src/app/api/admin/route.ts`

* **Session refresh:**
  Root-level `middleware.ts`
  `src/utils/supabase/middleware.ts`

* **UI components:**
  `src/components/ui` folder as source of all form controls, inputs, and layouts.

#### Coding Conventions

* Start server action files with `'use server'`.
* Client components use `'use client'`.
* All async user actions placed in `/actions.ts` inside their route.
* API endpoints must use `route.ts`.
* Layout and page-level files remain server components by default.
* Use Supabase SSR client for protected operations:

  * `auth.getUser()` for authorization
* Avoid `getSession()` in server code.

#### Style & UI

* Follow shadcn/ui patterns.
* Neutral colors, responsive layout, consistent spacing.
* Component files in `components/ui` stay presentational.

#### Current Active Goals

* Finish block editor.
* Implement full drag-and-drop.
* Save layout and styling to Supabase.
* Add custom domain verification and Host-based routing.
* Complete admin-level API routes.

---

If you want, I can turn this into a **template version** you keep inside your repo and update as the project evolves.
