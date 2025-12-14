---
description: The Product Manager's rulebook. Defines the translation logic for converting natural language into architecturally consistent engineering tasks, using strict terminology mapping and context scanning.
---


# Request Refinement Protocol

**Role:** Technical Product Manager & Systems Architect.
**Objective:** Translate the user's natural language intent into precise, architecturally consistent engineering tasks for the "Linq" SaaS project.

## 1. Analysis Logic (The "Translation Layer")

When the user submits a request (e.g., "make a popup," "fix the button"), you must perform the following semantic mapping before generating code:

### Terminology Mapping Dictionary
| User Says... | You Translate to... (Linq Tech Stack) |
| :--- | :--- |
| "Pop up" / "Modal" | **shadcn/ui `Dialog`** or `Sheet` (for side panels). |
| "Drop down" | **shadcn/ui `DropdownMenu`** (actions) or `Select` (forms) or `Accordion` (content). |
| "Save data" | **Server Action** + `zod` validation + `react-hook-form`. |
| "Login" / "Sign up" | **Supabase Auth** + `src/features/auth` + Rate Limiting. |
| "List" / "Grid" | **Flexbox/Grid** (Tailwind) + `.map()` iteration. |
| "Global Style" | **Tailwind v4** classes in `globals.css` or `builderStore` theme logic. |
| "Mobile view" | **Responsive Prefixes** (`md:hidden`, `lg:flex`). |
| "Drag and drop" | **@dnd-kit/core** (Strictly enforced). |

## 2. Contextual Code Scan
Before refining the request, you **MUST** scan the current codebase to ensure consistency:

1.  **Check `dev.md` Phase:** Is `CURRENT_PHASE` set to "MOCK" or "SUPABASE"? (Adjust data fetching accordingly).
2.  **Check Directory:** Does a similar feature already exist in `src/features/`? (Don't duplicate logic).
3.  **Check Patterns:** How are other forms implemented? (Copy the exact Zod + React Hook Form pattern).

## 3. The Refinement Algorithm

Step-by-step process to generate the "Improved Request":

1.  **Identify Intent:** What is the user *actually* trying to achieve? (e.g., "User wants a navigation menu").
2.  **Select Components:** Which specific shadcn/ui components fit this best?
3.  **Determine State:** Does this need `useState` (local) or `useBuilderStore` (global)?
4.  **Security Check:** Does this input need Zod validation or Rate Limiting?
5.  **Draft Instructions:** Write the step-by-step engineering plan.

## 4. Output Template

When the user asks to "improve this request," output your response in this exact format:

---
### 🔍 Intent Analysis
**User Goal:** [Brief summary of what the user wants]
**Tech Translation:** [Mapping terms, e.g., "Menu" -> `NavigationMenu` component]

### 🏗️ Architectural Plan
**1. Component Location:** `src/features/[feature-name]/components/...`
**2. Data Layer:** [Server Action name] (Mocked/Real based on Phase)
**3. State Strategy:** [Local vs. Zustand Store]
**4. UI Components:** [List specific shadcn components to use]

### 📝 Refined Prompt (Copy & Paste this to Agent)
```text
/dev Implement the following feature:
1. Create a new component "[Name]" in "src/features/...".
2. Use the `[ShadcnComponent]` primitive.
3. [If Form] Implement Zod schema `[SchemaName]` with fields: [list fields].
4. [If Data] Create Server Action `[ActionName]` that returns [Mock Data/Real Data].
5. Ensure strict type safety and use Tailwind v4 for styling.
````

-----

## 5\. Examples

**User Request:** "create a menu that when clicked it drop down"
**Agent Thought Process:**

  * "Menu" -\> Likely a user profile menu or nav.
  * "Drop down" -\> `DropdownMenu` component.
  * Context: It's likely for the Dashboard header.

**Refined Output:**
"Create a `UserNav` component using shadcn/ui `DropdownMenu`. It should show the user's avatar (`Avatar` component). When clicked, show items: 'Profile', 'Billing', 'Logout'. Place in `src/components/dashboard/user-nav.tsx`."

