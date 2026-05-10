# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- Created `VerifyAccessForm`, `RewardsHeader`, `RewardCard`, `CreateRewardDialog`, `TaskDetailsDialog`, and `RewardsDashboard` components.
- Added `updateReward`, `deleteReward`, `updateTask`, and `deleteTask` API client methods.
- Created `RewardFormDialog` to handle both reward creation and updates.

### Changed
- Modularized the Next.js home and rewards pages into smaller, focused components in the `components/` directory.
- Converted main page files (`page.tsx`) to Server Components to leverage Next.js App Router benefits.
- Added eye icon visibility toggle for the secret key input on the login page.
- Implemented JWT session persistence using browser cookies.
- Protected the `/rewards` page with a client-side authentication check.
- Added a Logout button to the Rewards page.
- Integrated the JWT token into all API requests via the `Authorization` header.
- Implemented update and delete functionality for both rewards and tasks in the UI.
- Enhanced `TaskDetailsDialog` with inline task editing and task deletion.
- Added quick action buttons (edit/delete) to `RewardCard`.
- Refactored reward creation logic into a unified `RewardFormDialog`.
- Reorganized `rewards` components into a modular directory structure (`dialogs/`, `tasks/`).
- Extracted granular sub-components (`TaskItem`, `TaskForm`, `TaskList`) to improve maintainability.
- Integrated `AlertDialog` for all destructive actions (delete reward/task).
- Implemented task completion toggle (undo/redo).

### Fixed
- Centralized the `RewardWithTasks` interface in `types/index.ts` to resolve type mismatch errors.
- Resolved cascading render linting warnings in the rewards dashboard by optimizing `useEffect` orchestration.
- Updated `SKILL.md` files (`nextjs-component`, `nextjs-page`, `nextjs-api-client`) with modular architecture patterns and standardized `apiFetch` usage.
- Updated `ARCHITECTURE.md` to reflect the new feature-based component organization and data layering.



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
