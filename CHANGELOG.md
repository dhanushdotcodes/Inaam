# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- Created a consolidated **Quests** dashboard (`/quests`) for global task tracking across all rewards.
- Implemented modular quest components: `QuestDashboard`, `QuestList`, `QuestItem`, `QuestHeader`, and `QuestFilters`.
- Added automatic sorting for quests where completed items smoothly animate to the bottom of the list.
- Implemented **`RewardsOverview`** component to standardize the financials/stats dashboard.
- Added a logout button to the mobile bottom navigation bar for functional parity with desktop.
- Created a centralized **`DashboardHeader`** component to handle page titles and sidebar toggling consistently.

### Changed
- Renamed the Rewards (items) route to **`/vault`** and the Treasury (stats) route to **`/rewards`** for better domain alignment.
- Updated the **Sidebar** navigation and styling to follow new UI guidelines (consistent spacing, premium active indicators).
- Refactored `rewards/page.tsx` and `vault/page.tsx` into clean, component-based entry points.
- Aligned global UI tokens: standardized inputs/buttons to `h-10` height and `rounded-xl` border radius.
- Enhanced layout animations using `motion/react` and `AnimatePresence` with `popLayout` for smooth reordering.
- Updated `SidebarContext` to implement responsive "Persistent vs. Drawer" behavior based on device size.
- Modularized project rules by splitting `.agents/rules/rules.md` into domain-specific files (`backend.md`, `frontend.md`, etc.).
- Created a centralized root `rules.md` acting as a registry for both project rules and `docs/` documentation.

### Fixed
- Standardized dashboard-wide horizontal spacing using a unified `<main>` container with responsive padding.
- Corrected sidebar icon mapping (Vault = Wallet, Rewards = Gift) to match the new naming conventions.
- Fixed the missing `updateTask` import in the Quest dashboard.
- Resolved inconsistent header heights by standardizing the `DashboardHeader` usage.



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
