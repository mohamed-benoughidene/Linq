---
description: Step-by-step protocol for AI assistants building the Linq builder. Enforces corrected plan compliance, mandatory 3-test validation (console+visual+persistence), responsive editing (Popover+Sheet), live preview vs apply button patterns, and dual lock
---

# Builder Development Workflow

**Step-by-step protocol for AI assistants working on the Linq builder**

---

## 📋 Pre-Implementation Checklist

Before starting ANY work, verify you have access to:

- [ ] `builder-context-for-ai-corrected.md` - Execution protocol, testing requirements, commit standards
- [ ] `complete-implementation-plan-corrected.md` (Part 1) - Phases 0-4 detailed steps
- [ ] `complete-implementation-plan-part2-corrected.md` (Part 2) - Phases 5-10 detailed steps
- [ ] `instructions.md` - Technical standards and patterns
- [ ] `migration-plan-correct-implementation.md` - If migrating from old plan

---

## 🔄 Standard Workflow (For Each Step)

### Step 1: Read Protocol

**Read `builder-context-for-ai-corrected.md` FIRST**

Extract:
- ✅ 5 critical architectural decisions (responsive, live/apply, dual locks, debounce, auto-test)
- ✅ 3-test requirement per step (console + visual + persistence)
- ✅ Common gotchas to avoid
- ✅ Commit message format

**Critical Reminders from Context:**
- Users MUST be able to edit on mobile (Popover + Sheet)
- CSS changes = LIVE preview, Themes/Interactions = APPLY button
- Two independent locks: `themeLocked` + `microInteractionsLocked`
- Content editing uses 500ms debounce
- NEVER commit without passing all 3 tests

### Step 2: Locate Step Code

**Read the appropriate plan file:**

- **Phases 0-4**: `complete-implementation-plan-corrected.md` (Part 1)
- **Phases 5-10**: `complete-implementation-plan-part2-corrected.md` (Part 2)
- **Migration**: `migration-plan-correct-implementation.md` (if applicable)

**Extract from step:**
- What it does (description)
- Which files to modify
- Exact code to implement
- Test procedures (3 tests)
- Commit message

### Step 3: Verify Standards

**Read `instructions.md`**

Verify implementation matches:
- ✅ Responsive editing pattern (Popover + Sheet)
- ✅ Hybrid styling (inline for custom values, Tailwind for interactions)
- ✅ TypeScript strictness (no `any` types)
- ✅ Database operations (server actions only)
- ✅ State management (Zustand store)
- ✅ Debouncing pattern (500ms for content)

### Step 4: Identify User's Request

**Parse the user's message to determine:**
- Which phase? (0-10)
- Which step? (e.g., Phase 2, Step 2.3)
- Migration or fresh implementation?
- Any special requirements?

**Example User Requests:**
```
"Build Step 2.3" → Phases 0-4, Step 2.3
"Continue with Phase 5" → Start Phase 5, Step 5.1
"Migrate from old plan" → Use migration plan
```

### Step 5: Implement the Step

**Follow this exact sequence:**

1. **Announce what you're implementing**
   ```
   "Implementing Phase X, Step X.Y: [Description]
   Files to modify: [list]"
   ```

2. **Provide the exact code from plan**
   - Copy code character-for-character from plan
   - Include all imports
   - Add comments explaining key parts
   - Use correct types from `@/types/builder`

3. **Explain what the code does (ELI5 style)**
   ```
   "This code creates a responsive block editor:
   - On desktop (≥768px): Shows popover on right
   - On mobile (<768px): Shows drawer from bottom
   - Detects window size and switches automatically"
   ```

### Step 6: Provide Testing Instructions

**Always provide ALL 3 tests from the plan:**

#### Test 1: Console Test
```typescript
// Copy exact console commands from plan step
console.log(useBuilderStore.getState().blocks)
// Expected: [exact expected output]
```

#### Test 2: Visual Test
```
Desktop:
1. [Exact action]
   → [Expected result]

Mobile:
1. [Exact action]
   → [Expected result]
```

#### Test 3: Persistence Test
```
1. [Action]
2. Refresh page
3. [Expected result]
```

### Step 7: Provide Commit Message

**Copy exact commit message from plan:**

```bash
git add .
git commit -m "feat: make block editor responsive (popover + sheet)"
```

### Step 8: Confirm Understanding

**Ask user to confirm:**

```
"I've provided the code for Step X.Y. 

Before moving to the next step:
1. ✅ Run Test 1 (Console) - Verify state
2. ✅ Run Test 2 (Visual) - Verify UI on desktop AND mobile
3. ✅ Run Test 3 (Persistence) - Refresh and verify data persists

Once all 3 tests pass, commit with the message above.

Ready for the next step, or do you need help with testing?"
```

---

## 🧪 Testing Protocol (MANDATORY)

### Never Skip Testing

**Every step MUST pass all 3 tests before committing.**

### Test Execution Order

```
1. Implement code
2. Save files
3. Run Test 1 (Console)
   ├─ Pass? → Continue
   └─ Fail? → Debug, fix, re-test
4. Run Test 2 (Visual)
   ├─ Desktop test
   ├─ Mobile test
   ├─ Pass? → Continue
   └─ Fail? → Debug, fix, re-test
5. Run Test 3 (Persistence)
   ├─ Pass? → Continue
   └─ Fail? → Debug, fix, re-test
6. All pass? → Commit
7. Any fail? → Do NOT commit, debug first
```

### When Tests Fail

**Ask user:**
```
"Which test failed?
1. Console test - What did the console show?
2. Visual test - What happened vs what was expected?
3. Persistence test - What data didn't persist?

Please provide the exact error or unexpected behavior."
```

**Then debug step-by-step:**
- Check TypeScript errors
- Check console errors
- Verify imports
- Verify file paths
- Compare code with plan character-by-character
- Check for typos

---

## 🚨 Critical Validation Checks

### Before Providing Code

- [ ] Is this the corrected plan (not old plan)?
- [ ] Does BlockEditor use Popover + Sheet (not just Popover)?
- [ ] Do CSS changes update instantly (no apply button)?
- [ ] Do themes/interactions require Apply button click?
- [ ] Does Block type have BOTH locks?
- [ ] Does content editing use 500ms debounce?
- [ ] Are all types properly defined (no `any`)?
- [ ] Are database operations server actions?

### After Providing Code

- [ ] Did I provide exact code from corrected plan?
- [ ] Did I include all 3 tests?
- [ ] Did I provide exact commit message?
- [ ] Did I explain what the code does?
- [ ] Did I remind about testing before committing?

---

## 🔀 Migration Workflow (If Applicable)

**When user says "agent already started old plan":**

### Step M1: Assess Current State

```
"Let me check the current implementation state.

Can you provide:
1. Which phases/steps have been completed?
2. Which files exist in these directories:
   - src/components/builder/
   - src/components/sidebar/
   - src/store/
   - src/types/
3. Output of: git log --oneline --decorate (last 10 commits)"
```

### Step M2: Use Migration Plan

**Follow `migration-plan-correct-implementation.md`:**

1. Read migration steps M1-M10
2. Identify which steps apply
3. Implement corrections sequentially
4. Test each correction (3 tests)
5. Commit each correction

**Migration steps correct:**
- Add `microInteractionsLocked` to types
- Add `globalMicroInteractions` to store
- Install Sheet component
- Make BlockEditor responsive
- Add Apply buttons to themes/interactions
- Emphasize debouncing

### Step M3: Resume Normal Workflow

**After migration complete:**

Resume with corrected plan from appropriate phase.

---

## 💡 Response Templates

### Starting a Step

```markdown
## Implementing Phase X, Step X.Y: [Description]

**What**: [One-sentence summary]
**Files**: [List of files to modify]

### Code

```typescript
[Exact code from plan]
```

### Explanation

[ELI5 explanation of what this does]

### Testing

**Test 1: Console**
```typescript
[Console commands]
// Expected: [output]
```

**Test 2: Visual**
```
Desktop:
- [Action] → [Result]

Mobile:
- [Action] → [Result]
```

**Test 3: Persistence**
```
1. [Action]
2. Refresh
3. Expected: [Result]
```

### Commit

```bash
git add .
git commit -m "[exact message from plan]"
```

---

**Ready for next step? Run all 3 tests first, then let me know!**
```

### When User Reports Test Failure

```markdown
Let me help debug this.

**Which test failed?**
- [ ] Test 1 (Console)
- [ ] Test 2 (Visual)
- [ ] Test 3 (Persistence)

**What happened?**
[Wait for user response]

**What was expected?**
[From plan]

**Common causes:**
1. [List relevant gotchas from instructions]
2. [Suggest checks]

Let's debug step by step...
```

### When User Asks to Skip Testing

```markdown
⚠️ **Testing is mandatory - we cannot skip.**

Here's why:
1. **Prevents bugs** - Catches issues immediately
2. **Validates implementation** - Ensures code works as planned
3. **Maintains quality** - Each step builds on previous
4. **Saves time** - Debugging later is harder

The 3 tests take ~2 minutes total. Debugging broken code later takes 30+ minutes.

**Let's run the tests:**
[Provide test instructions again]
```

---

## 🎯 Quality Checklist

### Before Saying "Step Complete"

- [ ] Code matches corrected plan exactly
- [ ] All 3 tests provided with expected results
- [ ] Commit message provided
- [ ] Explanation provided (ELI5)
- [ ] User reminded to test before committing
- [ ] No old plan patterns used
- [ ] No assumptions or improvisations

### Red Flags (Never Do This)

- ❌ Providing code without tests
- ❌ Saying "skip testing, it's simple"
- ❌ Using old plan patterns (desktop-only, auto-apply, single lock)
- ❌ Combining multiple steps
- ❌ Improvising code not in plan
- ❌ Using `any` types
- ❌ Suggesting client-side database operations

---

## 📚 Quick Reference Hierarchy

**When implementing, check in this order:**

1. **builder-context-for-ai-corrected.md** - Protocol & critical decisions
2. **Appropriate plan file** - Exact code for the step
3. **instructions-corrected.md** - Technical patterns & standards
4. **migration-plan** - Only if migrating from old plan

**When debugging:**

1. **Instructions** - Common mistakes section
2. **Context** - Gotchas section
3. **Plan** - Expected behavior from step
4. **User's error** - Actual vs expected

---

## 🚀 Success Metrics

### Step is Complete When:

✅ Code implemented matches plan exactly  
✅ User confirmed Test 1 passed (console)  
✅ User confirmed Test 2 passed (visual on desktop + mobile)  
✅ User confirmed Test 3 passed (persistence)  
✅ User committed with exact message from plan  
✅ Ready to move to next step  

### Phase is Complete When:

✅ All steps in phase completed  
✅ All tests passed for all steps  
✅ All commits made  
✅ User ready for next phase  

---

## 📖 Summary

**For every step requested:**

1. ✅ Read context (protocol & testing)
2. ✅ Read plan (exact code & tests)
3. ✅ Read instructions (verify standards)
4. ✅ Identify user's specific step
5. ✅ Implement strictly following protocol:
   - Provide exact code from plan
   - Explain what it does
   - Provide all 3 tests
   - Provide commit message
   - Remind to test before committing
6. ✅ Validate before responding (no old patterns)
7. ✅ Confirm understanding with user

**Never skip testing. Never use old plan. Never improvise. Always follow corrected plan exactly.**

---

**When in doubt, ask Mohamed. When still in doubt, check the corrected plan. Never guess.** 🎯