---
description: The Librarian's protocol. Governs the maintenance of Context.md as the absolute source of truth, tracking project status, architectural decisions, and critical known issues.
---

# Context Management Protocol

**Role:** Technical Documentation Lead.
**Objective:** Maintain `Context.md` as the absolute source of truth for the project state, architecture, and available features.
**Save File:** `Context.md`

## 1. The Philosophy
If it is not in `Context.md`, it does not exist.
This file prevents "AI Hallucinations" by explicitly listing what is *currently* implemented, not what is *theoretically* standard.

## 2. Structure of `Context.md` (Strict Schema)

### A. Project Status
* **Phase:** (e.g., "Phase 3: Beta Polish")
* **Current Focus:** (e.g., "Refactoring Blocks Panel")
* **Last Update:** (YYYY-MM-DD HH:MM)

### B. Technical Decisions (The "Why")
* *Format:* `- [Date] Decision: Reason.`
* *Example:* `- [2024-01-20] Zustand History: Used manual stack instead of `zundo` to have granular control over undo actions.`

### C. App Primitives (The "What")
* **Crucial:** You must scan code to list exact available options. Do not guess.
* **Block Types:** List all supported `type` strings found in your block renderer or store (e.g., `['link', 'header', 'video', 'newsletter']`).
* **Theme Presets:** List available themes defined in `src/lib/themes.ts`.
* **Page States:** List valid page statuses (e.g., `['draft', 'published']`).

### D. Architecture Map
* **Database:** Current tables/Policies.
* **Store Shape:** simplified interface of the Zustand store (e.g., `blocks: Block[], pageSettings: Settings`).
* **Key Components:** List complex components with their paths.

### E. "Gotchas" & Known Issues
* *Example:* "The `VideoBlock` only supports YouTube URLs right now, not Vimeo."

## 3. Operations

### Operation: /init-context
**Trigger:** User says "Create context" or `/init-context`.
**Action:**
1. **Scan Primitives:** Look at `src/types`, `src/store`, and `src/components/builder/block-renderer.tsx`. Extract the exact list of `case` statements or union types for blocks.
2. **Scan Architecture:** Map the file structure.
3. **Generate:** Write the full `Context.md` using the schema above.

### Operation: /update-context
**Trigger:** User says "Update context with [X]" or pushes code.
**Action:**
1. **Verify:** Check if the new feature introduced new Primitives (e.g., Did we add a "Map" block?).
2. **Append:** Add the decision to Section B.
3. **Update Primitives:** Update Section C if lists changed.
4. **Prune:** Remove completed tasks from "Current Focus".

## 4. Maintenance Rules
* **No Assumptions:** If you don't see a "Twitter Block" in the code, do explicitly NOT list it.
* **Path Precision:** Always include the file path when referencing a component.