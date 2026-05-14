# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- Created four specialized documentation and audit skills:
    - **`doc-client-components`**: Maps component hierarchies and data flow using Mermaid diagrams.
    - **`audit-styling`**: Audits the UI for inconsistencies against design guidelines.
    - **`audit-code-quality`**: Identifies DRY and KISS violations and structural technical debt.
    - **`doc-client-context`**: Documents high-level business logic and feature domains.
- Added comprehensive client-side documentation in the `.context/` directory:
    - **`client-context.md`**: High-level overview of feature domains and user flows.
    - **`client-components.md`**: Interactive Mermaid map of component relationships.
    - **`audit-styling-results.md`**: Detailed report on design system alignment.
    - **`audit-quality-results.md`**: Audit of code patterns and architectural integrity.
- Introduced **`Sorting Logic`** section to the client documentation to formalize item ordering rules.

### Changed
- Implemented **completion-aware sorting** across all major dashboards:
    - Active tasks and unclaimed rewards are prioritized at the top of lists.
    - Within groups, items are sorted chronologically (latest first).
    - Completed tasks and claimed rewards are pushed to the bottom and sorted by their completion/claimed timestamp.
- Updated **`TaskList`**, **`ObjectiveList`**, **`RewardsOverview`**, and **`RewardsDashboard`** to support the new sorting logic.
- Synchronized the **`SKILL.md`** registry to include the 4 new specialized documentation skills.

### Fixed
- Added `min-h-0` to the primary dashboard layout container to prevent layout overflow issues and ensure smooth scrolling.
- Replaced the deprecated `.context/dashboard-context.md` with the more comprehensive `client-context.md`.



## [0.2.0] - 2026-05-09

### Added
- Implemented Rewards Dashboard page at `/rewards` with task tracking and progress bars.
- Refactored Reward cards to open a detailed Task Dialog on click.
- Implemented task management within the dashboard (add tasks, toggle completion).
- Integrated Rewards and Task API clients in `apps/client/lib/api.ts`.
- Added Shadcn/UI components (Card, Dialog, Button, Badge, etc.) to the client.
- Implemented Authentication verification gate on the home page with secret-key verification.
- Added redirect logic from home page to `/rewards` upon successful verification.

### Changed
- Modularized Next.js skills documentation into specialized guides.
- Replaced the initial health check dashboard with the secure Auth Verification gate.

## [0.1.1] - 2026-05-09

### Added
- Configured environment variable `NEXT_PUBLIC_SERVER_URL` for the client.
- Implemented a premium health check dashboard in the Next.js client home page.
- Containerized the Next.js client using Bun Alpine for local development.
- Added `dev-web` command to the root `Makefile` for easier local development.

### Fixed
- Resolved `Permission denied` error for `prestart.sh` by running it with `sh` explicitly in the server Dockerfile.
- Fixed host file permissions for `apps/server/scripts/prestart.sh`.

### Changed
- Refactored `apps/client/app/page.tsx` to remove boilerplate and integrate with backend health API.

## [0.1.0] - 2026-05-08

### Added
- Initial Docker infrastructure (`docker-compose.local.yml`, `Dockerfile`).
- SQLAlchemy 2.0 models for `Task` and `Reward`.
- Alembic migration system with asynchronous support.
- Root `Makefile` for project automation.
- Environment variable management system (`.env`, `_env.local`).
- Created core project structure following Senior Full Stack conventions.
- Implemented `POST /api/v1/auth/login` endpoint with SHA-256 key verification.
- Integrated JWT authentication for session management.
- Added integration testing suite with `pytest` and `TestClient`.
- Configured CORS middleware in FastAPI application.
