# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- Introduced **`task_type`** (`BOUNTY` | `OBJECTIVE`) to the task model to differentiate between independent tasks and reward-linked tasks.
- Added **`TaskType`** enum in the backend (`models/enums.py`) and frontend (`types/index.ts`).
- Created a custom Alembic migration to handle PostgreSQL Enum creation and data migration for existing tasks.
- Implemented a comprehensive **Points System** and transaction ledger to track user progress and reward claiming.
- Created **`transaction_service`** in the backend to manage point history (`EARNED`, `SPENT`, `BONUS`, `PENALTY`) and calculate balances.
- Added **`PointsDisplay`** component to the frontend, providing real-time balance updates across Quests, Rewards, and Vault pages.
- Implemented **Economy Rewards** support: claiming rewards of type `ECONOMY` now deducts points and validates balance.
- Added new API endpoints: `GET /api/v1/points`, `GET /api/v1/transactions`, and `POST /api/v1/transactions`.
- Integrated automatic point earning: completing a task now automatically generates an `EARNED` transaction.

### Changed
- Refactored terminology across the entire project for better domain alignment:
    - **Quests**: Task-based rewards (formerly `DIRECT`).
    - **Prizes**: Economy-based rewards (formerly `ECONOMY`).
    - **Bounties**: Independent tasks.
    - **Objectives**: Tasks linked to a Quest.
- Renamed the primary task management route from `/quests` to **`/tasks`**.
- Refactored frontend components to use the new nomenclature: **`TaskDashboard`**, **`TaskHeader`**, **`TaskList`**, **`TaskItem`**, and **`TaskCreateForm`**.
- Updated **`RewardCard`** and **`RewardsOverview`** to explicitly distinguish between Quest progress and Prize redemption.
- Enhanced **`RewardFormDialog`** to support creating both Quests and Prizes with appropriate inputs (e.g., points cost for prizes).
- Updated project documentation (`PRD.md`, `DB_SCHEMA.md`, `API_SPEC.md`) to reflect the new architecture.
- Refactored task completion logic: transitioned from boolean `completed` to `completed_at` timestamp for better audit trails.
- Differentiated task creation APIs: introduced `createRewardTask` to distinguish from standalone `createTask`.
- Switched to `completeTask` API for all task completion actions to ensure point transactions are triggered.
- Updated **`QuestDashboard`**, **`RewardsOverview`**, and **`TaskItem`** to react to a custom `refreshPoints` event for immediate UI updates.
- Refined **`Button`** component sizes and variants to align with the latest minimalist design standards.
- Aligned core primary theme tokens: mapped `--primary` to `#131313` (`brand-night`) and `--primary-foreground` to `#F3F3F3` (`brand-white-smoke`) for native minimalist Apple/Vercel-like profile adaptivity.
- Redesigned **Quests** dashboard components (`QuestItem`, `QuestFilters`, `QuestHeader`, `QuestCreateForm`) with Framer Motion `layoutId` active indicator pill micro-animations, glassmorphism borders, and unconstrained input foundations compliance.
- Refactored `button.tsx` core variants to natively pull from synchronized global CSS primary/foreground styling classes.
- Renamed the Rewards (items) route to **`/vault`** and the Treasury (stats) route to **`/rewards`** for better domain alignment.
- Aligned Sidebar layout with EOS UI guidelines (w-[264px] width, h-[48px] items, px-6 py-9 padding) and implemented 24px square active indicators for collapsed states.
- Refactored `rewards/page.tsx` and `vault/page.tsx` into clean, component-based entry points.
- Aligned global UI tokens: standardized inputs/buttons to `h-10` height and `rounded-xl` border radius.
- Enhanced layout animations using `motion/react` and `AnimatePresence` with `popLayout` for smooth reordering.
- Updated `SidebarContext` to implement responsive "Persistent vs. Drawer" behavior based on device size.
- Modularized project rules by splitting `.agents/rules/rules.md` into domain-specific files (`backend.md`, `frontend.md`, etc.).
- Created a centralized root `rules.md` acting as a registry for both project rules and `docs/` documentation.
- Refined **`RewardsOverview`** quest filtering logic: now only displays quests that are fully completed (no objectives left) and have at least one task.
- Integrated **`AlertDialog`** for a confirmed and secure reward claiming and prize redemption flow.
- Standardized UI across the Rewards page to align with the project's minimalist aesthetics:
    - Updated **`RewardCard`** with `rounded-[24px]` radius and optimized icon containers.
    - Synchronized all dashboard button heights to **`h-10`** (40px) for consistent interaction feel.
    - Added high-contrast clinical readability tracking (`tracking-[-0.02em]`) to all major UI titles.
- Updated **`.context/ui-guidelines.json`** to reflect the standardized `h-10` button height across the dashboard.

### Removed
- Permanently deleted `ButtonPreview.tsx` component.

### Fixed
- Resolved a TypeScript error in `TaskDashboard.tsx` where string literals were used instead of `TaskType` enum members.
- Corrected the parameter order for `updateTask` in the reward task management UI.
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
