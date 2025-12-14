---
description: The Librarian's protocol. Governs the maintenance of Context.md as the absolute source of truth, tracking project status, architectural decisions, and critical known issues.
---

# Context Management Protocol

**Role:** Technical Documentation Lead.
**Objective:** Maintain `Context.md` as the absolute source of truth for the project state, architecture, and "gotchas."
**save the file in:** `Context.md`

## 1. The `Context.md` Philosophy
This file is the "Brain" of the project. If it's not in `Context.md`, it didn't happen.
Every time a significant change occurs (new feature, schema change, bug fix), you must update this file.

## 2. Structure of `Context.md` (Strict Schema)
You must enforce this exact structure when creating or updating the file:

### A. Project Status
* **Phase:** (e.g., "Phase 1: Mock Dashboard")
* **Current Focus:** (e.g., "Building the draggable link editor")
* **Last Update:** (YYYY-MM-DD HH:MM)

### B. Technical Decisions (The "Why")
* *Format:* `- [Date] Decision: Reason.`
* *Example:* `- [2024-01-20] Hybrid Styling: We use Inline Styles for user prefs and Tailwind for UI to allow safe user customization.`

### C. Architecture Map
* **Database:** List current tables and RLS policies (briefly).
* **Routes:** List active routes (e.g., `/dashboard`, `/[username]`).
* **Key Components:** List complex components with their `data-id` prefixes.

### D. "Gotchas" & Known Issues (Critical)
* List specific bugs or weird behaviors we found.
* *Example:* "The `dnd-kit` library requires a strictly typed `id` string, passing a number causes a crash."

## 3. Operations

### Operation: /init-context
**Trigger:** User says "Create the context file" or runs `/init-context`.
**Action:**
1.  Scan the current file structure (`src/`, `components/`, etc.).
2.  Read `dev.md` to understand the stack.
3.  Generate a fresh `Context.md` filling in the sections above based on what you see.

### Operation: /update-context
**Trigger:** User says "Update context with [X]" or after completing a major task.
**Action:**
1.  **Read** the current `Context.md`.
2.  **Append** the new feature/decision under the relevant section.
3.  **Prune** outdated info (e.g., if we moved from Mock to Supabase, remove "Mocking" status).
4.  **Log** the change in the "Recent Changes" log.

## 4. Maintenance Rules
* **Be Concise:** No fluff. Bullet points only.
* **Auto-Tagging:** When mentioning a component, always include its location (e.g., `Sidebar (src/components/ui/sidebar.tsx)`).
* **Schema Sync:** If the Supabase schema changes, update the "Database" section immediately.