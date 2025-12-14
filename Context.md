# Project Context

**Role:** Technical Documentation Lead.
**Objective:** Maintain `Context.md` as the absolute source of truth for the project state, architecture, and "gotchas."

## 1. Project Status
* **Phase:** Phase 1: Builder & Customization
* **Current Focus:** Implementing Theme Engine and Dynamic Styling.
* **Last Update:** 2025-12-14 22:30

## 2. Technical Decisions (The "Why")
- [2025-12-12] **Framework:** Next.js 16.0.10 (App Router) + React 19.2.1 for latest features and performance.
- [2025-12-12] **Styling:** Tailwind CSS v4 for developer UI flexibility, paired with inline styles for user customizations (Hybrid Styling).
- [2025-12-12] **Auth & DB:** Supabase (Postgres + Auth + RLS) for backend-as-a-service.
- [2025-12-12] **Testing:** Vitest + React Testing Library + JSDOM for unit and component testing.
- [2025-12-12] **Security:** Upstash Redis for rate limiting critical endpoints.
- [2025-12-13] **Architecture & UI:** Switched to **Component-Based Architecture** using Shadcn UI. Organized by layer (`src/components/`, `src/hooks/`) rather than feature folders to align with standard Next.js patterns.
- [2025-12-14] **Theme Engine:** Implemented `ThemePreset` system. We use a global `currentTheme` object in the store to drive dynamic inline styles for user-generated content (Canvas/Blocks) while keeping the editor UI (Sidebar/Panels) in standard Tailwind.

## 3. Architecture Map
* **Database:** Supabase (Pending setup).
* **Routes:**
    * `/` (Home/Landing) - `src/app/page.tsx`
    * `/dashboard` - `src/app/dashboard/page.tsx`
* **Key Components:**
    * **Sidebar:** `AppSidebar` (src/components/app-sidebar.tsx) - Main navigation using Shadcn Sidebar.
    * **Builder:**
        * `BuilderCanvas` (src/components/builder/builder-canvas.tsx) - The main drag-and-drop area.
        * `LinkBlock` (src/components/builder/link-block.tsx) - The individual link components.
        * `ThemesPanel` (src/components/builder/panels/themes-panel.tsx) - Sidebar panel for selecting themes.
    * **UI Primitives:** `src/components/ui/*` (Button, Input, Sheet, Sidebar, etc.)
* **State Management:**
    * `useBuilderStore` (src/store/builder-store.ts) - Manages `blocks`, `layout`, and `currentTheme`.
* **Libraries:**
    * `THEMES` (src/lib/themes.ts) - Definitions for visual presets (Clean, Retro Pop, etc.).

## 4. "Gotchas" & Known Issues (Critical)
* **Protocol Split:** `dev.md` has been deprecated/deleted. Refer to individual protocol files:
    - `.agent/debug.md` (Error Resolution)
    - `.agent/test.md` (QA & Testing)
    - `.agent/context_manager.md` (Context Updates)
* **Dynamic Styling:** Components rendered in the builder canvas (`LinkBlock`) CANNOT rely solely on Tailwind classes for appearance. They MUST strictly subscribe to `currentTheme` and use inline styles for: `background`, `color`, `border`, `borderRadius`, and `boxShadow`.
