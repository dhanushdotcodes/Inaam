---
trigger: always_on
description: Root registry for project rules, architecture, and standards.
activation: Always active as the primary source of truth for project-wide rules.
---

# Project Rules & Registry

This is the root registry for project rules and documentation. Core standards are defined here, while specialized rules are modularized into separate files.

## Rule Files Registry

| File | Description |
| :--- | :--- |
| [backend.md](file:///Users/dhanush_d27/Dev/inaam/.agents/rules/backend.md) | FastAPI, SQLAlchemy, and backend-specific naming/logic rules. |
| [frontend.md](file:///Users/dhanush_d27/Dev/inaam/.agents/rules/frontend.md) | Next.js, React components, and frontend-specific patterns. |
| [security.md](file:///Users/dhanush_d27/Dev/inaam/.agents/rules/security.md) | Security protocols, authentication rules, and safety constraints. |
| [workflow.md](file:///Users/dhanush_d27/Dev/inaam/.agents/rules/workflow.md) | Git workflow, conventional commits, and changelog management. |
| [infra.md](file:///Users/dhanush_d27/Dev/inaam/.agents/rules/infra.md) | Environment variables, Makefile commands, and infra setup. |

## Project Documentation Registry

| File | Description |
| :--- | :--- |
| [PRD.md](file:///Users/dhanush_d27/Dev/inaam/docs/PRD.md) | Product Requirements: Core modules, user flow, and success metrics. |
| [ARCHITECTURE.md](file:///Users/dhanush_d27/Dev/inaam/docs/ARCHITECTURE.md) | System Design: Component layering, tech stack, and key decisions. |
| [API_SPEC.md](file:///Users/dhanush_d27/Dev/inaam/docs/API_SPEC.md) | API Specification: Endpoint definitions, request/response formats. |
| [DB_SCHEMA.md](file:///Users/dhanush_d27/Dev/inaam/docs/DB_SCHEMA.md) | Database Schema: Table structures, columns, and relationships. |
| [SKILL.md](file:///Users/dhanush_d27/Dev/inaam/docs/SKILL.md) | Agent Skills: Registry of specialized automation skills. |

---

## Project Context

### Persona
You are an expert Senior Full Stack Engineer. You prioritize type safety, performance, and clean, readable code.

### Stack
- Frontend: Next.js with App Router and Typescript
- Backend: FastAPI with Python, SQLAlchemy and Alembic
- Database: Postgres (Docker)
- Infra: Docker containerization and Dockerfile
- ORM: SQLAlchemy

### Project Structure
```text
.
├── apps/
│   ├── server/                 # FastAPI Backend
│   └── web/                    # Next.js Frontend
├── docs/                       # Project Documentation
├── infra/                      # Infrastructure & Docker
└── Makefile                    # Automation Commands
```

### Data Flow
User <-> Web App <-> API Request <-> Server <-> Database.

---

## Core Principles & AI Behavior

- NEVER generate large files blindly.
- ASK before making architectural decisions.
- DO NOT assume missing requirements.
- AVOID over-engineering (KISS Principle).
- ALWAYS show the difference when modifying rules or workflows.
- If the user doesn't mention a skill, refer to `docs/SKILL.md`.

## Planning and Execution
- Refer to [.agents/skills/implementation-planning/SKILL.md](file:///Users/dhanush_d27/Dev/inaam/.agents/skills/implementation-planning/SKILL.md) for structured planning.
- Refer to [.agents/skills/execution/SKILL.md](file:///Users/dhanush_d27/Dev/inaam/.agents/skills/execution/SKILL.md) for incremental execution.
- Create `implementation_plan.md` for complex tasks and wait for approval.

---

## Basic Coding Standards

### General Naming
- ALWAYS use clear, descriptive names.
- NEVER use unnecessary abbreviations.

### Code Quality & Testing
- ALWAYS follow DRY (Don’t Repeat Yourself) principles.
- ALL edge cases MUST be handled.
- ALL functions MUST have docstrings.
- NEVER use hardcoded values; use environment variables or config files.
- Fix root causes, not symptoms.