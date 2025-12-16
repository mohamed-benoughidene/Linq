# Project Context

**Role:** Technical Documentation Lead.
**Objective:** Maintain `Context.md` as the absolute source of truth for the project state, architecture, and "gotchas."

## 1. Project Status
* **Phase:** Phase 2: Page Settings & User Support
* **Current Focus:** Polishing Settings logic (DNS verification) and Support workflow.
* **Last Update:** 2025-12-16 15:05

## 2. Technical Decisions (The "Why")
- [2025-12-12] **Framework:** Next.js 16.0.10 (App Router) + React 19.2.1 for latest features and performance.
- [2025-12-12] **Styling:** Tailwind CSS v4 for developer UI flexibility, paired with inline styles for user customizations (Hybrid Styling).
- [2025-12-12] **Auth & DB:** Supabase (Postgres + Auth + RLS) for backend-as-a-service.
- [2025-12-12] **Testing:** Vitest + React Testing Library + JSDOM for unit and component testing.
- [2025-12-12] **Security:** Upstash Redis for rate limiting critical endpoints.
- [2025-12-13] **Architecture & UI:** Switched to **Component-Based Architecture** using Shadcn UI. Organized by layer (`src/components/`, `src/hooks/`) rather than feature folders to align with standard Next.js patterns.
- [2025-12-14] **Theme Engine:** Implemented `ThemePreset` system. We use a global `currentTheme` object in the store to drive dynamic inline styles for user-generated content (Canvas/Blocks) while keeping the editor UI (Sidebar/Panels) in standard Tailwind.
- [2025-12-15] **Integrations:** Added `Calendly` and generic `Embed` blocks for external content support.
- [2025-12-16] **Theme Schema:** Extended `ThemePreset` to support `blockBackgroundType` for gradient support in individual blocks.
- [2025-12-16] **Page Settings:** Implemented comprehensive settings panel for SEO, Social Previews, and Domain configuration.
- [2025-12-16] **DNS Workflow:** Standardized Custom Domain DNS setup to require both **A Record** (root) and **CNAME** (www) for full coverage.
- [2025-12-16] **Support System:** Implemented a global `SupportDialog` driven by `zustand` state to provide immediate feedback/help access via the `AppSidebar`.

## 3. Architecture Map
* **Database:** Supabase (Pending setup).
* **Routes:**
    * `/` (Home/Landing) - `src/app/page.tsx`
    * `/dashboard` - `src/app/dashboard/page.tsx`
* **Key Components:**
    * **Sidebar:** `AppSidebar` (src/components/app-sidebar.tsx) - Main navigation using Shadcn Sidebar.
    * **Builder:**
        * `BuilderCanvas` (src/components/builder/builder-canvas.tsx) - The main drag-and-drop area.
        * `SettingsPanel` (src/components/builder/panels/settings-panel.tsx) - Logic for SEO, Domains, and Integrations.
        * `ThemesPanel` (src/components/builder/panels/themes-panel.tsx) - Sidebar panel for selecting themes.
    * **Dashboard:**
        * `SupportDialog` (src/components/dashboard/support-dialog.tsx) - Global help modal.
        * `DashboardLayout` (src/app/dashboard/layout.tsx) - Mounts global providers and dialogs.
    * **UI Primitives:** `src/components/ui/*` (Button, Input, Sheet, Sidebar, Dialog, Sonner, etc.)
* **State Management:**
    * `useBuilderStore` (src/store/builder-store.ts) - Manages `blocks`, `layout`, `currentTheme`, `pageSettings`, and `isSupportOpen`.
* **Libraries:**
    * `THEMES` (src/lib/themes.ts) - Definitions for visual presets (Clean, Retro Pop, etc.).

## 4. "Gotchas" & Known Issues (Critical)
* **Live Input Focus:** When building interactive panels (like `SettingsPanel`), NEVER define helper components (like `AccordionItem`) *inside* the main component body. This causes re-mounting on every state change (keystroke) and kills input focus. Always define them outside or in separate files.
* **Component Identifiers:** All interactive elements must have a `data-id` for testing stability.
* **Dynamic Styling:** Components rendered in the builder canvas (`LinkBlock`) CANNOT rely solely on Tailwind classes for appearance. They MUST strictly subscribe to `currentTheme` and use inline styles for: `background`, `color`, `border`, `borderRadius`, and `boxShadow`.
* **Nav Projects & Click Handlers:** The `NavProjects` component (used for Support section) must explicitly handle `onClick` props to prevent default link navigation behavior when triggering actions like opening modals.
