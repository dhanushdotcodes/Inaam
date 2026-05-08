# Architecture

## High level components
- Next.js App Router web app.
- Fastapi server.
- Postgres database.
- Dockerized setup for all components.
- CI workflow for linting and typecheck.

## Project Structure
---
```
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

## Layering
---
```
┌─────────────────────────────────────────┐
│         Client (Next.js)               │
│    ├──────────────────────────────────┤  
│    │     API Calls to FastAPI         │
│    └──────────────────────────────────┘
└─────────────────────────────────────────┘
        ↓
        ↓ (HTTP Request)
        ↓
┌─────────────────────────────────────────┐
│        Server (FastAPI)                 │
│    ├──────────────────────────────────┤  
│    │     1. Routes (Parse Request)    │
│    ├──────────────────────────────────┤
│    │     2. Services (Business Logic) │
│    ├──────────────────────────────────┤
│    │     3. Repositories (Query)      │
│    └──────────────────────────────────┘
        ↓
        ↓ (SQL Query)
        ↓
┌─────────────────────────────────────────┐
│         Database (PostgreSQL)             │
└─────────────────────────────────────────┘
```

---

## Principles
---
- KISS (Keep It Simple, Stupid)
- YAGNI (You Ain't Gonna Need This)
- DRY (Don't Repeat Yourself)
- SOLID:
  - Single Responsibility: Each function or component should do exactly one thing.
  - Open / Closed: Code should be easy to extend but shouldn't require changing the core logic.
- Keep your FastAPI business logic out of your Next.js UI components.

---

## Data Flow
---
```
User -> Web App (Next.js) -> API Call -> FastAPI Route -> FastAPI Service -> FastAPI Repository (SQLAlchemy) -> Database (Postgresql)
```
---

## Key Decisions
---
| Decision | Choice | Reasoning |
| --- | --- | --- |
| Web App | Next.js | Fast UI, Typescript, Supports Server side components and client side components, SEO, ease of use. 
| API Layer | FastAPI | Python's best framework for APIs, Type hints, Async support. 
| Database | PostgreSQL | Relational database with good performance, ease of use, community support, widely used. 
| ORM | SQLAlchemy | Widely used, Async support, 
| Containerization | Docker | Ease of Use, Community support, widely used.