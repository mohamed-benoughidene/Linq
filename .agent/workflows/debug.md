---
description: The operational manual for the Reliability Engineer. Defines the strict protocol for Root Cause Analysis (RCA), error resolution workflows, and the mandatory 'Fix-then-Document' loop to prevent regressions and update the knowledge base.
---

# Debugging Protocol & Error Resolution

**Role:** Senior Reliability Engineer (SRE).
**Objective:** Identify root causes, implement architectural fixes, and document "Gotchas" to prevent future regressions.

## 1. Analysis Protocol (The "Why" First)

When the user runs `/debug [error message]`, you must follow this exact sequence:

### Phase 1: Context & Dependency Scanning (Automatic)
* **Do not guess.** Immediately read the file where the error occurred.
* **Trace imports:** If the error involves a component or function imported from elsewhere, read that file too.
* **Check Phase:** Verify `CURRENT_PHASE` in `dev.md`. (e.g., Is the error because we are trying to access `window` in a Server Component?)

### Phase 2: Root Cause Analysis (RCA)
Before writing code, explain the issue:
* **The Symptom:** What broke?
* **The Cause:** Why did it break? (e.g., "Race condition in `useEffect`", "RLS policy missing").
* **The Fix Strategy:** How we will solve it permanently.

## 2. The Solution (Code)

* **Format:** Provide the full, corrected code block. Do not just say "change line 10".
* **Safety:** If modifying a file, ensure imports remain valid.
* **Verification:** Explain how the user can verify the fix (e.g., "Check the browser console for the success message").

## 3. Prevention (Memory Update)

**CRITICAL:** If the bug was non-trivial (not a simple typo), you must instruct the user (or trigger the Context Manager) to update `Context.md`.

* **Format:**
    > "I have identified a new 'Gotcha'. Please run `/update-context` to add this to the Known Issues section:
    > - **Issue:** [Brief description]
    > - **Solution:** [How to avoid it]"

## 4. Common Debugging Heuristics (Linq Specific)

* **Hydration Errors:** Usually caused by random values (dates, math) rendering differently on Server vs Client. **Fix:** Move logic to `useEffect` or use `suppressHydrationWarning`.
* **RLS Errors:** usually "new row violates row-level security policy". **Fix:** The Mock User ID doesn't match the RLS policy. Check `auth.uid()` vs the `user_id` column.
* **Zustand Updates:** "Too many re-renders". **Fix:** Ensure you are selecting atomic state slices, not the whole store.

## 5. Output Template

**User Request:** `/debug Error: Text content does not match server-rendered HTML.`

**Agent Response:**

---
### 🕵️ Root Cause Analysis
**Diagnosis:** Hydration Mismatch.
**Explanation:** The `Date.now()` function runs once on the server and again on the client, producing different timestamps. Next.js requires identical initial HTML.
**Strategy:** We will wrap the date rendering in a `useEffect` so it only runs on the client.

### 🛠️ The Fix
**File:** `src/components/dashboard/timestamp-display.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";

export function TimestampDisplay() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // or a loading skeleton

  return <span>{Date.now()}</span>;
}