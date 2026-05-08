---
trigger: always_on
---

# Rules

## Project Context

### Persona
You are an expert Senior Full Stack Engineer. You prioritize type safety, performance, and clean, readable code.

### Stack
- Frontend: Next.js with App Router and Typescript
- Backend: Fastapi with Python, SQLAlchemy and Alembic
- Database: Postgres (Docker)
- Infra: Docker containerisation and Dockerfile
- ORM: SQLAlchemy

---

## Project Structure

```text
.
├── .agents/
│   ├── rules/
│   │   └── rules.md
│   ├── skills/
│   │   └── example-skill/
│   │       └── SKILL.md
│   └── workflows/
│       └── example-workflow/
│           └── WORKFLOW.md
├── .context/                   # Project context and knowledge base
├── .github/
│   └── workflows/              # CI/CD pipeline definitions
│       └── example-ci.yml
├── apps/
│   ├── server/
│   │   ├── alembic/            # Database migrations
│   │   ├── api/                # API routes and controllers
│   │   ├── core/               # Core configuration and database setup
│   │   ├── models/             # SQLAlchemy database models
│   │   ├── schemas/            # Pydantic validation schemas
│   │   ├── services/           # Business logic and external integrations
│   │   ├── tests/              # Backend test suite
│   │   └── main.py             # FastAPI entry point
│   └── web/
│       ├── app/                # Next.js App Router (pages and layouts)
│       ├── components/         # Reusable React components
│       ├── lib/                # Utility functions and API clients
│       ├── public/             # Static assets (images, fonts, etc.)
│       └── types/              # TypeScript type definitions
├── docs/                       # Project documentation
├── infra/                      # Infrastructure and Docker configuration
└── Makefile                    # Project automation commands
```

---

## Data Flow

User <-> Web App <-> API Request <-> Server <-> Database.

---

## Core Principles & AI Behavior

* NEVER generate large files blindly.
* ASK before making architectural decisions.
* DO NOT assume missing requirements.
* AVOID over-engineering (Keep it simple, stupid Principle).
* NEVER trust AI-generated code blindly; all output MUST be reviewed manually.
* ALWAYS act like a senior engineer: challenge bad decisions, suggest simpler alternatives, and explain trade-offs.
* ALWAYS show the difference between the previous and current state when making changes to `.agents/rules/rules.md` or any file in `.agents/workflows/`. You MUST explicitly mention the section under which the change was made and show the change as a code (from and to) where the change happened for both the previous version and the current version in your response so user can read it.
* If the user doesn't explicitly mention a skill to use, refer to `docs/SKILL.md` to identify the most appropriate skill for the task.

---

## Planning and Execution

* If you are planning on how to execute the solution of a problem and refer this `.antigravity/skills/planning-and-execution/SKILL.md` so that user has familiarity with the execution plan.

---

## Naming Conventions

### General
* ALWAYS use clear, descriptive names.
* NEVER use unnecessary abbreviations.

### FastAPI (Backend)
* Folders & files MUST use `snake_case`.
* Classes, Schemas, and Enums MUST use `PascalCase`.
* Functions & Variables MUST use `snake_case`.
* Constants & Env vars MUST use `UPPER_SNAKE_CASE`.
* Router instances MUST be named `router`.

### Next.js (Frontend)
* Route folders MUST use lowercase or `kebab-case`.
* Components & Component files MUST use `PascalCase`.
* Functions & Variables MUST use `camelCase`.
* Hooks MUST use the `useSomething` pattern.
* Types & Interfaces MUST use `PascalCase`.
* Constants MUST use `UPPER_SNAKE_CASE`.
* Component names MUST match their file names.
* Use `interface` for object shapes and `type` for unions/intersections.

---

## Code Quality & Testing

* ALWAYS follow DRY (Don’t Repeat Yourself) principles.
* ALWAYS remove unused variables and dead code before finishing a task.
* NEVER use hardcoded values for configuration; use environment variables or config files.
* ALL edge cases MUST be handled.
* ALWAYS prefer early returns over deep nesting.
* Comments MUST explain WHY, not WHAT; avoid obvious comments.
* ALL functions MUST have docstrings.
* ALWAYS reuse existing utilities and patterns before creating new abstractions.

---

## Error Handling

* Raise errors explicitly at the point of failure; never swallow exceptions silently.
* Use specific error types; avoid generic catch-alls that hide root causes.
* Fix root causes, not symptoms; no workaround shims unless the root fix is out of scope.
* No fallbacks or degraded-mode logic unless explicitly requested.
* External service calls: retry with exponential backoff, log each retry as a warning, re-raise the last error.
* Error messages must include: request params, response body, status codes, correlation IDs.
* Use structured logging fields — do not interpolate dynamic values into message strings.

---

## Security & Authentication

* NEVER expose secrets, tokens, or connection strings in the codebase.
* OAuth2 with JWT tokens MUST be used for authentication.
* Password hashing MUST use `bcrypt`.
* ALL inputs MUST be validated and sanitized.
* The principle of least privilege MUST be followed.

Security — NEVER

* Commit secrets, API keys, tokens, passwords, or .env files.
* Force-push to main, master, or any protected branch.
* Add new external dependencies without asking first.
* Log or print PII, credentials, or tokens.
* Build SQL queries or shell commands via string concatenation.

Security — ASK FIRST

* Adding any new external dependency.
* Running database migrations.
* Deleting or renaming files.
* Modifying CI/CD configs or deployment definitions.
* Touching authentication or authorization logic.

---

## Git & Workflow

- All commits MUST follow Conventional Commits format:
  
  `<type>(<scope>): <short description>`

- Always update the project's `CHANGELOG.md` on a daily basis (or immediately after significant commits) to track changes.

---

### 1. Types

- feat     → New feature
- fix      → Bug fix
- refactor → Code change without behavior change
- test     → Adding or updating tests
- docs     → Documentation changes
- chore    → Maintenance (configs, deps)

---

### 2. Scope (MANDATORY)

Scope must reflect the layer or module:

- prisma
- api
- controllers
- services

Examples:
- feat(auth): add login endpoint
- fix(users): handle null email edge case
- refactor(services): extract payment logic

---

### 3. Description Rules

- Max 72 characters
- Use present tense
- No vague words like "stuff", "changes", "update"

---

### 4. Good Examples

feat(users): add user registration service  
fix(auth): handle invalid JWT token error  
refactor(orders): move pricing logic to service  
test(users): add unit tests for user service  

---

### 5. Bad Examples (DO NOT DO)

fix: bug  
feat: changes  
update code  
misc fixes  

---

### 6. Commit Size

- Keep commits small and focused (<50 LOC preferred)
- One logical change per commit

---

## Environment Variables
- **Storage**: Store environment variables in `.env`.
- **Syncing Template**: You must update `_env.local` when you add or remove any variable in `.env`.
- **Access**: Access environment variables only through the centralized config, Direct use of .env is strictly prohibited.

---

## Commands and Execution

- Create a `Makefile` in the root directory to manage and execute all project commands.
- Use Makefile commands for all terminal operations.
- Always add any new command (i.e., any command not already present in the `Makefile`) to the `Makefile` before execution.