# Architecture

## High level components
- Next.js App Router web app.
- Fastapi server.
- Postgres database.
- Dockerized setup for all components.
- CI workflow for linting and typecheck.

## Project Structure
---
```text
.
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
│   └── client/
│       ├── app/                # Next.js App Router (pages and layouts)
│       ├── components/         # Reusable React components
│       │   ├── rewards/        # Feature-specific modular components
│       │   │   ├── dialogs/    # Modals and popups
│       │   │   └── tasks/      # Granular sub-components
│       │   ├── ui/             # Base UI primitives (buttons, inputs)
│       │   └── shared/         # Shared feature components
│       ├── lib/                # Utility functions and API clients (apiFetch)
│       ├── public/             # Static assets (images, fonts, etc.)
│       └── types/              # TypeScript type definitions
├── docs/                       # Project documentation
├── infra/                      # Infrastructure and Docker configuration
└── Makefile                    # Project automation commands
```
---

## Layering
---
```text
┌─────────────────────────────────────────┐
│         Client (Next.js)               │
│    ├──────────────────────────────────┤  
│    │     API Calls (apiFetch)         │
│    └──────────────────────────────────┘
└─────────────────────────────────────────┘
        ↓
        ↓ (HTTP Request + JWT)
        ↓
┌─────────────────────────────────────────┐
│        Server (FastAPI)                 │
│    ├──────────────────────────────────┤  
│    │     1. Routes (Parse Request)    │
│    ├──────────────────────────────────┤
│    │     2. Services (Business Logic) │
│    ├──────────────────────────────────┤
│    │     3. Repositories (SQLAlchemy) │
│    └──────────────────────────────────┘
        ↓
        ↓ (Asynchronous SQL)
        ↓
┌─────────────────────────────────────────┐
│         Database (PostgreSQL)             │
└─────────────────────────────────────────┘
```

---

## Principles
---
- **KISS**: Keep It Simple, Stupid.
- **YAGNI**: You Ain't Gonna Need This.
- **DRY**: Don't Repeat Yourself (Centralized `apiFetch`, modular components).
- **SOLID**:
  - Single Responsibility: Extracted `TaskItem`, `TaskForm` from monolithic dialogs.
  - Open / Closed: Generic `AlertDialog` and `RewardFormDialog` are easy to extend.
- **Modular Component Architecture**: Group components by feature and role (dialogs, tasks, etc.).
- **Security & Multi-User Separation**: Strict resource gating ensuring that users can only interact with database rows associated with their `user_id` context.

---

## Security & Multi-User Separation
---
### Authentication Flow
1. **Registration/Login**: The user registers or logs in via `/api/v1/auth/signup` or `/api/v1/auth/login`. On successful password verification (using `bcrypt`), the server generates a signed JSON Web Token (JWT) using `HS256` encryption.
2. **Stateless Authorization**: Subsequent client requests include the token in the `Authorization: Bearer <JWT>` header. The FastAPI server validates this token using a custom `get_current_user` dependency.

### Database Gating
- All child models (`Reward`, `Task`, `PointTransaction`) are bound to the `users` table via `user_id` foreign keys with `ondelete="CASCADE"`.
- Every service-layer method queries database records by filtering on the authenticated `user_id`:
  ```python
  stmt = select(Task).where(Task.user_id == current_user.id)
  ```
- This guarantees complete cryptographic and logic gating between user accounts.

---

## Data Flow
---
```text
User -> Web App (Next.js) -> apiFetch (lib/api.ts) -> FastAPI Route -> get_current_user (JWT validation) -> FastAPI Service (filter by user_id) -> SQLAlchemy -> Postgres
```
---

## Key Decisions
---
| Decision | Choice | Reasoning |
| --- | --- | --- |
| Web App | Next.js 16 | Fast UI, React 19, Server Components, SEO, modular architecture. |
| API Layer | FastAPI | Python's best framework for APIs, Async support, Pydantic validation. |
| Database | PostgreSQL | Robust relational database, Docker-ready. |
| ORM | SQLAlchemy 2.0 | Advanced async ORM with returning clauses. |
| Component Design | Atomic/Feature-based | Modular folders (`dialogs/`, `tasks/`) for better maintainability. |
| API Client | apiFetch Wrapper | Centralized auth, error handling, and base URL config. |
| Session Management | Stateless JWT | Eliminates database session storage overhead and allows horizontal scaling. |
| Data Isolation | Schema-level Gating | `user_id` constraints on all models with SQLAlchemy CASCADE deletes to enforce data boundaries. |