# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- Implemented the **Daily Bonus Points System** on the backend, awarding compounding threshold bonuses (+300 for 2,000 Pts, +500 for 3,000 Pts, +1,000 for 4,000 Pts, and +2,000 for 5,000 Pts).
- Added dynamic timezone-aware calculation of daily earned points boundary utilizing client-passed timezone offsets.
- Authored a comprehensive integration test suite (`tests/test_daily_bonuses.py`) validating compound milestone triggers, database isolation, and recursive infinite loop prevention.
- Developed a premium glassmorphic dashboard widget (`DailyBonusProgress.tsx`) featuring glowing gradient tracking, responsive milestone badges, micro-animations, and live update reactivity.
- Implemented robust **Multi-User Data Separation** architecture on the FastAPI backend.
- Added `user_id` foreign keys linking to the `users` table on `rewards`, `tasks`, and `point_transactions` SQL models with cascading deletes.
- Created `get_current_user` JWT authentication dependency to extract claims and inject complete authenticated database User instances.
- Authored a comprehensive multi-user isolation integration test suite (`tests/auth/test_isolation.py`) verifying strict resource gating, action isolation, and separate point ledger calculations.
- Generated Alembic schema migration `7deccecb3d81_add_user_id_to_all_models.py` handling safe nullable-to-non-nullable migrations for pre-existing database records.
- Implemented user signup endpoint `POST /api/v1/auth/signup` supporting username, email, and password validation.
- Implemented email-based user login endpoint `POST /api/v1/auth/login` returning a JWT access token and user profile details.
- Integrated `bcrypt` library for cryptographically secure password hashing and verification.
- Added a full suite of API integration tests in `tests/auth/test_routes.py` validating successful signup, duplicate username/email detection, invalid field constraints, and successful/failed login flows against the live database.
- Created specialized documentation and audit skills:
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

### Removed
- Removed legacy key-based authentication (`verify_key`) from `services/auth.py` and key-based route branches from `/auth/login`.
- Removed `SECRET_KEY` environment variable setting from Pydantic config model.


### Changed
- Refactored `reward`, `task`, and `transaction` service layers to strictly filter database operations by user ID.
- Updated all API routes (`/rewards`, `/tasks`, `/points`) to inject the `get_current_user` dependency and enforce account boundaries.
- Re-architected routing database transaction patterns from explicit `db.begin()` blocks to clean `await db.commit()` calls to prevent Session deadlock issues from pre-dependency queries.
- Removed redundant Active/Completed capsules from **`TaskItem`** to streamline visual information hierarchy, utilizing distinct completed states (green checked circle, muted line-through titles, opacity reduction).
- Restructured **`TaskItem`** columns into a hyper-clean `[40px_1fr_220px_80px]` layout, grouping the delete button and Chevron dropdown trigger as a premium compact actions button cluster on the right-hand side.
- Refactored task list reordering and expansion animations in **`TaskItem`** from spring to tween (`easeInOut`, `0.25s` duration) to eliminate layout jumps and component overlapping.
- Positioned the Chevron bulge trigger inside the animated `<motion.div>` for perfect alignment during layout transitions.
- Adjusted paddings and margins on the task description accordion to make the expanded state more compact, wrapping it in a zero-padded outer motion container to guarantee smooth collapse height transitions all the way to 0px without sudden layout pops.
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
