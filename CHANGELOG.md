# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

### [Unreleased]

## [1.2.0] - 2026-05-29

### Added
- Implemented **Rank & Progression System** database schema.
- Added `user_progress` table to track `lifetime_xp`, `spendable_points`, `total_tasks_completed`, `perfect_weeks`, and `current_streak`.
- Added `user_rank_history` table to keep a chronological ledger of rank achievements.
- Created `core/ranks.py` containing the unified rank configuration and ladder.
- Developed `migrate_user_progress.py` script to backfill existing users' progression data by safely replaying their transaction history.
- Enforced strict database constraints via a multi-stage Alembic migration strategy.

## [1.1.0] - 2026-05-29

### Added
- Enhanced prize card redemption dialog to show full prize descriptions and a disabled state when the user has insufficient points.

### Fixed
- Fixed an indentation bug in the backend reward service that prevented point transactions from being created upon reward redemption.
- Intercept 401 Unauthorized API responses in the frontend client to correctly clear expired auth cookies and redirect to the login page.
- Prevented browser caching of API fetches by explicitly setting `cache: "no-store"` on the frontend HTTP client.
- Fixed an issue where pinned recurring tasks would visually jump to the unpinned section when completed.
- Fixed a critical backend bug where uncompleting a recurring task erroneously deleted all of its historical earned point transactions instead of just the most recent one.
- Prevented completed recurring tasks from appearing simultaneously in both the Active and Completed tabs on the dashboard.

## [1.0.0] - 2026-05-27

### Changed
- **Major Architectural Overhaul:** Completely removed the concepts of "Quests" and "Objectives" from the application. The app now focuses exclusively on independent "Bounties" (tasks) and "Prizes" (rewards).
- Refactored `get_tasks` and `get_rewards` API endpoints to remove quest and objective constraints.
- Updated database schema, dropping `reward_type`, `task_type`, and `reward_id` from the PostgreSQL tables with a data migration mapping existing Quests' `cost_points` to `0`.
- Revamped the client-side UI, completely deleting the `/quests` dashboard, simplifying `RewardFormDialog`, and extracting `reward_id` logic from all `Task` components.

### Fixed
- Fixed a React "Cannot create components during render" error in the sidebar by refactoring `NavContent` to a render function.

## [0.16.0] - 2026-05-27

### Added
- Created database seeding utility script `seed_data.py` utilizing `Faker` to populate mock users, tasks, quests, prizes, and transaction histories.
- Added `install-server` and `db-seed` targets in the root `Makefile` to simplify dependencies installation and seed execution.

### Changed
- Refactored `TaskItem` desktop grid layout to prevent the difficulty and points metadata column from wrapping into two rows, keeping them inline in a single row with auto-sizing while letting the title section adjust dynamically.
- Upgraded the Postgres Docker database image to `postgres:17-alpine` in `docker-compose.local.yml`.

### Fixed
- Resolved a TypeScript compilation error in `DifficultyBadge.tsx` where index-signature checks failed due to `TaskDifficulty.ALL` missing from the local config object.

## [0.15.0] - 2026-05-27

### Added
- Integrated the user's manual addition of `ALL = "ALL"` into the `TaskDifficulty` enum in `types/index.ts`.

### Changed
- Refactored `TaskFilters.tsx` and `RewardFilters.tsx` to remove the "All" status filter and standardise status filtering solely between "active" and "completed"/"claimed".
- Simplified difficulty selection by integrating `TaskDifficulty.ALL` directly into the difficulty drop-down in `TaskFilters.tsx`, eliminating the hybrid `TaskDifficulty | "all"` type union.
- Updated `useTasks` and `useRewards` frontend hooks, as well as `api.ts` clients, to align with the simplified status filter schemas ("active" and "completed"/"claimed").
- Repositioned the `DailyBonusProgress` widget inside `TaskDashboard.tsx` above the main loading loader, preventing the component from being unmounted and re-mounted from the DOM during list re-fetches and initial queries.

### Fixed
- Fixed an ESLint `unexpected any` type-safety violation in `TaskFilters.tsx` by using an exhaustive conditional check against strict `TaskDifficulty` values instead of a type assertion.
- Resolved a React cascading render warning (`setState` within a `useEffect`) inside `TaskFormDialog.tsx` by deferring the state update to a microtask using `Promise.resolve().then()`.

## [0.14.0] - 2026-05-27

### Added
- Implemented offset-based pagination fetching 20 items at a time across Tasks, Prizes, and Quests dashboards with a modern "Load more" interface.
- Developed a tab-based UI filter system (`RewardFilters.tsx`) separating active and claimed/completed quests and prizes.
- Added client-side debounced search fetches (300ms delay) that queries the backend for missing tasks and rewards.
- Integrated the unified premium borderless `Button` component in its neutral `ghost` variant for all load-more actions, incorporating automatic loading spinner animations and click-preventative disabled states.
- Developed a modular, generic client-side `useDebounce` hook to handle debouncing input fields and state values.

### Changed
- Refactored backend `get_tasks` service to support timezone-safe Python-level pagination and filtering.
- Refactored backend `get_rewards` service to execute database-level limit and offset queries via SQLAlchemy.
- Updated `getAllTasks` and `getRewards` in `api.ts` to serialize limit, offset, search, status, and type parameters.
- Overhauled `useTasks` and `useRewards` frontend state hooks to handle paginated merges, Set-based deduplication, and debounced search requests.

### Fixed
- Resolved synchronous `setState` cascading render warnings during initial fetches in `useTasks` and `useRewards` by deferring state initialization calls to the microtask queue using `Promise.resolve()`.

## [0.13.0] - 2026-05-27

### Added
- Created specialized `QuestCard.tsx` component to handle rendering of Quests, task lists, objective progress, and locks.
- Created specialized `PrizeCard.tsx` component to handle rendering of Prizes, points cost badges, and linear points progress bars based on the user's current points.
- Integrated `ObjectiveDetailsDialog` into the `PrizesDashboard` to show full prize details (title and description) upon card click.
- Placed interactive Claim and Redeem buttons in the footer of `ObjectiveDetailsDialog` next to the Close button, with disabled and neutral styling when goals are not met.
- Integrated loading indicators (`isLoading={isClaiming}`) into the dialog's Claim and Redeem buttons.

### Removed
- Deleted deprecated, unified `RewardCard.tsx` component.
- Removed intermediate confirmation `AlertDialog` popups for Quests and Prizes claiming/redemption to streamline the user flow and avoid "double dialogs".

### Changed
- Refactored `QuestsDashboard.tsx` and `PrizesDashboard.tsx` to render their respective specialized card components.
- Modified `ObjectiveDetailsDialog.tsx` to handle immediate claim/redemption upon clicking the footer action buttons.

### Fixed
- Resolved a Next.js/React hydration error caused by invalid HTML nesting (`<form>` inside `<form>`) by refactoring `ObjectiveForm.tsx` to use a `<div>` container instead of a `<form>` element, manually capturing key down events for the Enter key.
- Fixed tooltip clipping at the boundaries of the scrollable analytics chart container by introducing a boundary-aware translation shift in the custom tooltip component.
- Resolved React warning `"Error: Cannot create components during render"` inside `AnalyticsChartGraph` by moving the custom tick and dot components outside of the render function.
- Fixed production deployment caching issues on Vercel by adding custom cache-control headers in `next.config.ts` to prevent CDN and browser caching of `/sw.js`.
- Refactored service worker `sw.js` caching strategies: bypassed same-origin API routes, implemented Network-First for HTML documents and Next.js RSC data, and restricted Cache-First strictly to hashed, immutable assets under `_next/static/`.
- Enhanced service worker registration in `ServiceWorkerRegistrar.tsx` to detect updates and display a polished React toast (via the app's `useToast` hook) with an interactive "Refresh" action button instead of browser alert dialogues.
- Improved service worker pre-caching robustness during installation by using `Promise.allSettled` to prevent single asset fetch failures (e.g., 404s) from aborting the installation process.

## [0.12.0] - 2026-05-22

### Added
- Installed and integrated the `recharts` library for client-side composed chart data visualizations.
- Summed and mapped daily earned transaction points inside the analytics client to track rewards per date.
- Developed the **Task Analytics Dashboard & API Endpoint** to fetch and visualize completed task statistics daily over 7, 14, and 30 day windows.
- Added the backend endpoint `GET /api/v1/tasks/analytics` validating the range parameters and returning zero-filled stats for days with no activity.
- Implemented the backend service `get_task_analytics` which queries historical `point_transactions` of type `EARNED` shifted to the client's local timezone, guaranteeing accurate records even for recurring or deleted tasks.
- Authored a comprehensive integration test suite `tests/test_analytics.py` verifying range calculations, timezone adjustments, and validation criteria.
- Added typescript interfaces and client-side `getTaskAnalytics` API fetch method, passing local timezone offsets dynamically.
- Integrated the "Analytics" link with the `BarChart2` icon in the desktop and mobile sidebar navigation lists.
- Built an interactive dashboard page `/analytics` featuring summary counters (Total, Daily Average, Peak, and Points), a responsive SVG bar chart with Framer Motion spring height transitions, hover tooltips, and a completed tasks activity timeline.
- Extended backend `tasks` database schema with a `pinned` boolean column, supporting a 2-stage database migration with Alembic and data backfill for existing records.
- Implemented task pinning limit (maximum 3 pinned tasks) with a UI divider separating pinned and regular tasks.

## [0.11.1] - 2026-05-20

### Changed
- Updated the Inaam app branding logo asset.
- Refactored client dashboard layout: replaced the unclaimed points banner with an aligned task list header.
- Refactored and adjusted the bonus points progress bar and task item details.

## [0.11.0] - 2026-05-19

### Added
- Implemented **Weekly Recurring Bounties** allowing tasks to repeat automatically on specific days of the week.
- Extended backend `tasks` database schema with `is_recurring` and `recurrence_days` columns, alongside Alembic migrations.
- Introduced timezone-aware "self-healing" reset mechanism in the backend `get_tasks` service that dynamically computes and uncompletes recurring bounties based on the client's local `tz_offset`, avoiding complex background cron jobs.
- Added a premium circular weekday selector toggle to the `TaskFormDialog` for intuitive recurrence scheduling.

### Changed
- Added an auto-close effect to `TaskItem` that gracefully collapses the expanded accordion state whenever a task is marked as completed.

### Fixed
- Resolved database migration `IntegrityError` when adding the `is_recurring` column to pre-existing tables by dividing the schema change into three steps: adding the column as nullable, backfilling existing rows to `False`, and altering the column to `NOT NULL`.

## [0.10.0] - 2026-05-18

### Added
- Implemented **Undo Task Completion Feature** on the backend and frontend. Added `PATCH /tasks/{id}/incomplete` and `PATCH /rewards/{id}/task/{task_id}/incomplete` endpoints to revert completed standalone bounties and quest objectives.
- Developed the **Uncomplete Task Service** to safely reset completion status, clear completion timestamps, and automatically delete the associated earned transaction to guarantee perfect point ledger consistency.
- Introduced a lightweight, reactive **Zustand-based Toast Store** (`useToast.ts`) that manages real-time interactive notifications supporting custom action triggers.
- Created an ultra-premium, glassmorphic **`ToastContainer` UI** utilizing Framer Motion (`motion/react`) with spring transitions, animated countdown progress bars, dismiss triggers, and interactive click-to-undo triggers.
- Authored a comprehensive backend integration test suite (`tests/test_uncomplete_task.py`) covering complete/uncomplete actions for both standalone bounties and nested quest objectives.
- Implemented the **Daily Bonus Points System** on the backend, awarding compounding threshold bonuses (+300 for 2,000 Pts, +500 for 3,000 Pts, +1,000 for 4,000 Pts, and +2,000 for 5,000 Pts).
- Added dynamic timezone-aware calculation of daily earned points boundary utilizing client-passed timezone offsets.
- Authored a comprehensive integration test suite (`tests/test_daily_bonuses.py`) validating compound milestone triggers, database isolation, and recursive infinite loop prevention.
- Developed a premium glassmorphic dashboard widget (`DailyBonusProgress.tsx`) featuring glowing gradient tracking, responsive milestone badges, micro-animations, and live update reactivity.
- Implemented robust **Multi-User Data Separation** architecture on the FastAPI backend.
- Added `user_id` foreign keys linking to the `users` table on `rewards`, `tasks`, and `point_transactions` SQL models with cascading deletes.
- Created `get_current_user` JWT authentication dependency to extract claims and inject complete authenticated database User instances.
- Authored a comprehensive multi-user isolation integration test suite (`tests/auth/test_isolation.py`) verifying strict resource gating, action isolation, and separate point ledger calculations.
- Generated Alembic schema migration `7deccecb3d81_add_user_id_to_all_models.py` handling safe nullable-to-non-nullable migrations for pre-existing database records.

### Changed
- Moved toast points badges inline beside the message and restored card points to metadata details in `ToastContainer.tsx` and `TaskItem.tsx`.

## [0.9.0] - 2026-05-17

### Added
- Integrated difficulty dropdown filter on dashboard and enabled quest-name searching.
- Implement premium border bulge toggle on interactive buttons and smooth sidebar collapse transitions.
- Integrated brand logo and regenerated progressive web app (PWA) manifest icons.

### Fixed
- Improved caching of service worker `sw.js` and general progressive web app assets.

## [0.8.0] - 2026-05-16

### Added
- Implemented dark mode toggle with `next-themes` and `react-icons`.

### Changed
- Migrated the application styling to a token-based unified design system and centralized difficulty level badge colors.
- Standardized feature folder structures, refactored raw badges to shared primitives, and replaced native confirm dialogues with beautiful `AlertDialog` alerts.
- Refactored client-side code: implemented shared abstractions, custom hooks, and migrated general state management to Zustand based on architectural audit findings.
- Added new brand fonts and core UI foundations containing primitives and semantic tokens of the app.

## [0.7.1] - 2026-05-15

### Fixed
- Fixed small styling layout alignment issues on client dashboard components.

## [0.7.0] - 2026-05-14

### Added
- Implemented fully integrated **Transaction History** feature with visual dialog records list.
- Implemented **completion-aware sorting** across all major dashboards (TaskList, ObjectiveList, RewardsOverview, and RewardsDashboard), prioritizing active tasks and unclaimed rewards, sorting chronologically, and pushing completed/claimed items to the bottom.
- Created specialized documentation and audit skills: `doc-client-components`, `audit-styling`, `audit-code-quality`, and `doc-client-context`.
- Added comprehensive client-side documentation in the `.context/` directory covering feature domains, component hierarchies, design systems, and code patterns.

### Changed
- Standardized UI button heights and updated overall frontend design guidelines.
- Refined quest filtering mechanisms and implemented immediate claim confirmations.
- Refactored `TaskItem` UI: replaced standard dropdown menus with a unified accordion Chevron trigger housing task descriptions, recurrence badges, and Edit/Delete controls.
- Restructured `TaskItem` layout columns into a compactactions button cluster, using tween transitions instead of spring animations to prevent layout jumps.
- Replaced the deprecated `.context/dashboard-context.md` with the more comprehensive `client-context.md`.

### Fixed
- Fixed container package caching issues by adding `-V` to Makefile container upgrades.
- Resolved dashboard main container scrollable clipping issue by adding `min-h-0`.

## [0.6.0] - 2026-05-13

### Added
- Restructured reward and task system with new vocabulary and domain terminology (renaming rewards to Quest and Prize, tasks under rewards to objectives).
- Implemented transaction ledger, robust backend points calculation system, and global points display UI.
- Comprehensive database schema update adding user, points, and rewards relations.

### Changed
- Modularized project rules, created documentation registry, and decoupled specific guidelines.

## [0.5.0] - 2026-05-12

### Added
- Made rewards claimable with dynamic point updates.
- Consolidated quest tracking and standardized navigation flows.

## [0.4.0] - 2026-05-11

### Added
- Created sidebar and sidebar context for responsive layouts.
- Added Poppins fonts and updated Tailwind CSS configuration.
- Configured progressive web app (PWA) manifest support and branding assets.

### Fixed
- Resolved CORS issues, API path prefix errors, environment variable loader parsing bugs, and double slash client-side URL formatting.

## [0.3.0] - 2026-05-10

### Added
- Implemented user signup endpoint `POST /api/v1/auth/signup` supporting username, email, and password validation.
- Implemented email-based user login endpoint `POST /api/v1/auth/login` returning a JWT access token and user profile details.
- Integrated `bcrypt` library for cryptographically secure password hashing and verification.
- Added a full suite of API integration tests in `tests/auth/test_routes.py` validating successful signup, duplicate username/email detection, invalid field constraints, and successful/failed login flows against the live database.
- Implemented user login and signup portals with validation schemas and secure redirect rules on the frontend.
- Added key-based authentication verification gates on the dashboard home page.

### Removed
- Removed legacy key-based authentication (`verify_key`) from `services/auth.py` and key-based route branches from `/auth/login`.
- Removed `SECRET_KEY` environment variable setting from Pydantic config model.

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
