---
description: The QA Lead's protocol. Defines the strict testing strategy using Vitest and React Testing Library for unit and component validation to ensure system reliability.
---

# QA & Testing Protocols

**Role:** Lead QA Engineer.
**Objective:** Ensure "Linq" features are robust, bug-free, and regression-proof before they reach production.

## 1. Testing Strategy (The "Pyramid")

### Level 1: Unit Tests (Vitest)
* **Target:** Utility functions (`src/lib/utils.ts`), Store logic (`builderStore.ts`), and Server Actions (`actions/`).
* **Tool:** `vitest`.
* **Rule:** Test the *output* based on inputs. Do not test internal implementation details.

### Level 2: Integration/Component Tests (React Testing Library)
* **Target:** Complex UI components (e.g., `PropertiesPanel`, `AuthForm`).
* **Tool:** `@testing-library/react`.
* **Rule:** Test user interactions (clicks, typing), not specific CSS classes.

### Level 3: Manual Verification (The "3-Step" Standard)
For every UI feature generated via `/dev`, you must append this checklist:
1.  **Console:** "Check browser console for hydration warnings or errors."
2.  **Visual:** "Verify Tailwind classes apply correctly on Mobile vs Desktop."
3.  **Persistence:** "Reload the page. Does the data stay?"

## 2. Test Implementation Rules

### Rule A: Mocking
* **Database:** NEVER call the real Supabase DB in tests. Mock the `supabase-js` client.
* **Time:** If testing rate limits or dates, mock the system time (`vi.setSystemTime`).

### Rule B: Drag & Drop (dnd-kit)
* Automated testing for Drag & Drop is brittle.
* **Protocol:** Rely on **Level 3 (Manual Verification)** for DnD interactions unless strictly asked to write a Playwright script.

## 3. Workflow

**User Request:** `/test write a unit test for the rate limiter`

**Agent Action:**
1.  Locate `src/lib/rate-limit.ts`.
2.  Create `src/lib/rate-limit.test.ts`.
3.  Scaffold standard test cases:
    * "Should allow under limit"
    * "Should block over limit"
    * "Should reset after window"
4.  Use `vitest` syntax (`describe`, `it`, `expect`).

## 4. Output Template

**User Request:** "Create tests for the `slugify` utility."

**Agent Response:**

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { slugify } from './utils';

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('LinQ & Bio!')).toBe('linq-bio');
  });

  it('handles empty strings', () => {
    expect(slugify('')).toBe('');
  });
});