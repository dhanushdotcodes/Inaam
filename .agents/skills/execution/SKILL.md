----
name: execution
description: Execute approved implementation plans incrementally with strict scope control, review checkpoints, validation, and isolated commits.
----

# Skill: Execution

## When to Use

Use this skill when:
- an implementation plan has already been approved
- executing multi-file changes
- implementing backend/frontend features
- modifying APIs, database logic, middleware, services, or UI flows
- performing scoped refactors
- validation and review checkpoints are required

Do NOT use when:
- only planning is required
- brainstorming architecture
- answering conceptual questions
- performing large exploratory debugging
- making tiny isolated fixes that do not require execution discipline

---

## Input

The assistant should have access to:
- approved implementation plan
- affected files
- project architecture
- coding conventions
- framework rules
- testing requirements
- user constraints

Example:
- FastAPI + PostgreSQL + Prisma
- Existing JWT middleware
- Pytest integration tests required
- Existing service-repository architecture

---

## Constraints and Guidelines

### Scope Discipline

Only implement:
- what belongs to the current step
- what was approved in the implementation plan

Never:
- refactor unrelated systems
- rename unrelated files
- optimize unrelated logic
- introduce silent architecture rewrites
- modify unrelated formatting/styling

If unrelated issues are discovered:
- mention them separately
- do not fix them automatically

---

### File Visibility

Before execution, always provide:

### Files Being Changed

- api/server/auth/routes.py
- api/server/auth/service.py
- NEW: api/server/middleware/auth_guard.py

Rules:
- Prefix new files/folders with `NEW:`
- Mention only files expected to change
- Avoid unrelated modifications

---

### Step Discipline

Execution must:
- follow the implementation plan strictly
- complete one logical milestone at a time
- remain reviewable after every step

Rules:
- one logical concern per step
- avoid hidden side effects
- maintain clear execution boundaries

---

### Review Discipline

After completing each step:
- stop execution
- summarize changes
- explain why the change was made
- wait for user approval before continuing

Never continue automatically through all steps unless explicitly instructed.

---

### Commit Discipline

After user approval:

```bash
git add .
git commit -m "<meaningful commit message>"
```

Rules:
- one logical change per commit
- commits must remain reversible
- avoid combining unrelated work

Good:
```bash
git commit -m "add JWT auth middleware"
```

Bad:
```bash
git commit -m "backend updates"
```

---

### Code Quality Rules

Generated code must:
- follow existing project conventions
- remain readable and maintainable
- avoid over-engineering
- avoid duplicated logic
- use clear naming conventions

Prefer:
- consistency over cleverness
- existing abstractions over unnecessary new patterns

---

### Dependency Rules

Never:
- add dependencies silently
- modify environment configuration silently
- introduce database migrations without explanation

Always explain:
- why a dependency/change is needed
- what impact it introduces
- what systems are affected

---

### Validation Rules

After each logical milestone:
- run relevant tests if possible
- validate affected functionality
- ensure no obvious regressions

Validation may include:
- unit tests
- integration tests
- API verification
- type checking
- linting
- manual verification

If validation is skipped:
- explicitly mention why

---

### Failure Handling

If blocked:
- stop execution
- explain the blocker clearly
- explain possible solutions
- ask for clarification if needed

Never:
- fabricate APIs
- invent project structure
- assume hidden architecture
- continue under uncertainty

---

## Steps to Execute

### Step 1 — Understand Current Scope

- Read the current implementation step carefully
- Identify affected systems
- Understand dependencies and risks
- Verify scope boundaries

Output:
- clear understanding of the current milestone

---

### Step 2 — Inspect Existing Code

- Read surrounding implementation
- Understand existing patterns
- Follow project conventions
- Reuse existing abstractions when appropriate

Output:
- implementation aligned with existing architecture

---

### Step 3 — Implement Scoped Changes

Implement only:
- changes required for the current step

Rules:
- avoid unrelated edits
- preserve readability
- maintain backward compatibility when possible

Output:
- completed logical milestone

---

### Step 4 — Validate Changes

Perform:
- relevant testing
- sanity checks
- type validation
- API verification if applicable

Output:
- validated implementation state

---

### Step 5 — Prepare Review Summary

After implementation, summarize:

### Completed
- Added JWT middleware
- Integrated route protection
- Added auth integration tests

### Files Modified
- api/server/auth/routes.py
- NEW: api/server/middleware/auth_guard.py

### Validation
- Pytest integration tests passing
- Manual middleware verification completed

### Potential Risk Areas
- token expiration handling
- middleware ordering

---

### Step 6 — Pause for Review

Wait for:
- approval
- requested changes
- feedback

Do not continue automatically unless explicitly instructed.

---

### Step 7 — Commit Approved Changes

After approval:

```bash
git add .
git commit -m "<descriptive commit message>"
```

Then summarize:
- what the commit represents
- why it matters
- potential debugging boundaries

Example:

### Commit Summary

Added centralized JWT authentication middleware.

This commit isolates authentication logic from route handlers and enables reusable route protection.

Potential debugging area:
- token extraction
- middleware request state handling

---

## Output Format

The assistant should produce:
1. Files being changed
2. Implementation progress
3. Validation results
4. Review summaries
5. Commit summaries
6. Risk areas if applicable

All outputs must remain:
- concise
- structured
- review-friendly
- easy to scan

---

## Suggested Next Skills

Depending on task state, consider:
- testing
- debugging
- deployment
- refactoring
- documentation

The assistant should recommend next skills,
but allow the user to override or skip them.

---

## Checklist

- [ ] Only scoped files were modified
- [ ] No unrelated refactors introduced
- [ ] Implementation follows project conventions
- [ ] Changes remain logically isolated
- [ ] Relevant validation/tests completed
- [ ] User review checkpoint respected
- [ ] Commit represents one logical milestone
- [ ] Risks and follow-up areas documented
- [ ] No silent dependency or architecture changes introduced