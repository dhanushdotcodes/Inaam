----
name: implementation-planning
description: Creates structured, review-friendly implementation plans with scoped execution boundaries and commit discipline.
----

# Skill: Implementation Planning & Execution

## Purpose

This skill ensures:
- predictable implementation planning
- small logical execution steps
- review-friendly progress
- isolated commits
- safe incremental development

The assistant must optimize for:
- clarity
- reversibility
- traceability
- minimal unrelated modifications

---

# When to Use

Use this skill when:
- implementing a new feature
- modifying existing architecture
- refactoring scoped systems
- performing multi-file changes
- executing tasks requiring user review checkpoints

Do NOT use when:
- answering conceptual questions
- making tiny single-line fixes
- performing exploratory debugging without confirmed scope
- generating standalone explanations without implementation

---

# Input

The assistant should collect:

- task objective
- tech stack
- affected systems
- architectural constraints
- user preferences
- coding conventions
- testing expectations
- deployment impact (if any)

Example:
- FastAPI + PostgreSQL + Prisma
- JWT authentication
- Existing RBAC middleware
- Pytest integration tests required

---

# Constraints & Guidelines

## Planning Constraints

- Maximum 7 implementation steps
- Group related work together
- Avoid unrelated modifications
- Prefer incremental implementation
- Prefer explicitness over cleverness

If work exceeds 7 logical steps:
- recommend splitting into multiple plans
- explain why smaller plans are safer
- continue only if user explicitly requests

---

## File Visibility Rules

Before execution, always provide:

### Files Being Changed

- api/server/auth/routes.py
- api/server/auth/service.py
- NEW: api/server/middleware/auth_guard.py

Rules:
- Prefix new files/folders with `NEW:`
- Avoid touching unrelated files
- Mention only expected file modifications

---

## Execution Safety Rules

Never:
- refactor unrelated systems
- rename unrelated files
- introduce hidden architectural changes
- add dependencies silently
- modify environment configuration without notice

Always explain:
- why the change exists
- what problem it solves
- what systems it affects

---

## Review Rules

After each completed step:
- stop execution
- ask for user review
- continue only after approval

---

## Commit Rules

After user approval:

```bash
git add .
git commit -m "<meaningful message>"
```

Rules:
- one logical change per commit
- commits must remain reversible
- avoid combining unrelated work
- follow conventional commits standard in `./agents/rules/rules.md`.

Good:
```bash id="glx5qn"
git commit -m "fix(auth): handle invalid JWT token error"
```

Bad:
```bash id="rhy4m5"
git commit -m "fixed backend"
```

---

# Steps to Execute

## Step 1 — Define Scope

- Understand the complete requirement
- Identify affected systems
- Identify risks and dependencies
- Ask clarifying questions if needed

Output:
- scoped implementation direction

---

## Step 2 — Create Implementation Plan

Generate:

### Files Being Changed

- file paths

### Implementation Steps

Each step must include:

#### Objective
What this step accomplishes.

#### Files
Files affected in this step.

#### Why
Reason this step exists.

#### Expected Outcome
Observable result after completion.

#### Next Step
Dependency or continuation.

---

## Step 3 — Execute Incrementally

For each step:
- implement only scoped changes
- avoid unrelated modifications
- maintain code consistency
- validate functionality

After completion:
- pause for review

---

## Step 4 — Commit Progress

After approval:
- create isolated git commit
- summarize completed milestone

---

## Step 5 — Final Summary

Provide:

### Implementation Summary
- steps completed
- systems modified
- tests executed
- known limitations

### Commit Breakdown

For each commit:
- what changed
- why it matters
- potential debugging areas

Example:

#### Commit 1
Added centralized auth middleware.

Potential debugging area:
token extraction or middleware ordering.

---

# Output Format

The assistant should produce:

1. Files being changed
2. Structured implementation steps
3. Incremental execution updates
4. Commit summaries
5. Final implementation summary

All outputs must remain:
- concise
- scannable
- review-friendly
- logically grouped

---

# Checklist

- [ ] Scope fully understood
- [ ] Files identified before execution
- [ ] Steps grouped logically
- [ ] No unrelated modifications introduced
- [ ] User review checkpoints respected
- [ ] Each commit represents one logical change
- [ ] Tests/validation completed
- [ ] Code follows project conventions
- [ ] Final summary provided

---

# Suggested Next Skills
- execution/SKILL.md