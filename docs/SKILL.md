# Agent Skills Registery

This document tracks all active `SKILL.md` files used for AI agent automation.

## Summary

- **Total Skills**: 9
- **Last Updated**: 2026-05-09

## Active Skills

| Skill Name | Description | Folder Path | Trigger Phrases | Status | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `containerise-app` | Containerises an app for local dev (Dockerfile/docker-compose) | `.agents/skills/containerise-app` | "containerise app", "create dockerfile" | Active | @user |
| `create-new-skill` | Creates new skills in the registry with user input | `.agents/skills/create-new-skill` | "create new skill", "new workflow" | Active | @user |
| `fastapi-server-tests` | Writes integration pytest tests for FastAPI APIs | `.agents/skills/fastapi-server-tests` | "write tests", "API integration tests" | Active | @user |
| `handle-db` | Manages migrations and schema changes with Alembic/SQLAlchemy | `.agents/skills/handle-db` | "modify database", "alembic migration" | Active | @user |
| `fastapi-api` | Builds new FastAPI API endpoints (route → schema → service) | `.agents/skills/fastapi-api` | "create API", "new endpoint", "add route" | Active | @user |
| `implementation-planning` | Creates structured implementation plans and commit discipline | `.agents/skills/implementation-planning` | "new feature", "refactor system" | Active | @user |
| `nextjs-page` | Creates Next.js App Router pages, layouts, loading/error states, and SEO metadata | `.agents/skills/nextjs-page` | "create page", "new route", "add layout" | Active | @user |
| `nextjs-component` | Builds reusable React components with typed props and Tailwind CSS v4 styling | `.agents/skills/nextjs-component` | "new component", "build component", "UI element" | Active | @user |
| `nextjs-api-client` | Builds API client functions, TypeScript types, and client-side form handling | `.agents/skills/nextjs-api-client` | "API client", "fetch function", "add types", "form handling" | Active | @user |

## Skill Audit Log
- **2026-05-09** Replaced monolithic `next.js` skill with 3 focused sub-skills: `nextjs-page`, `nextjs-component`, `nextjs-api-client`.
- **2026-05-08** Added `fastapi-api` and `next.js` skills to the registry.
- **2026-05-08** Synchronized registry with `.agents/skills/` directory.

---
## Template for New Skill
```yaml
----
name: skill-name
description: Brief description of what the skill does in one sentence.
----

# Skill: Name of the Skill

## When to Use
Use this skill when:
- Trigger condition 1
- Trigger condition 2

Do NOT use when:
- Anti-trigger condition 1
- Anti-trigger condition 2

---

## Input
- Tech stack, parameters, architecture info, etc.
- Example inputs or user parameters required.

---

## Constraints and Guidelines

- example 1
- example 2

---

## Steps to Execute

1. Step One
   - Detail about step one.
   - Any specific sub-actions or tools to use.

2. Step Two
   - Detail about step two.

3. Step Three
   - Detail about step three.

---

## Output Format
- Expected output, files created, or structure.
- Details of how artifacts are formatted and shared.

---

## Checklist
- [ ] Requirements and scope are fulfilled
- [ ] No hardcoded configuration has been introduced
- [ ] Tests or validation steps have been executed
- [ ] Code follows project standards and rules
```
