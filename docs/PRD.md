# Product Requirements Document

## Inaam

A lightweight Progressive Web Application (PWA) designed for managing bounties and redeeming point-based prizes.
## Core Modules
- Authentication Management - Multi-user signup and password-based access using JWT session tokens and secure bcrypt hashing.
- Multi-User Data Separation - Strict account isolation gating rewards, tasks, and ledger transactions, ensuring users only access their own data.
- Reward Management - Add, Edit, Delete Prizes.
- Task Management - Add, Edit, Delete Bounties (with support for daily/weekly recurrence).
- Progress Tracking - Track points progression towards Prizes.
- Points Tracking - Earn points from Bounties, including compounding daily milestone bonuses, to spend on Prizes.
- Productivity Analytics - Visualize daily completion stats, daily average metrics, consistency percentages, and transaction logs over 7, 14, and 30-day windows.
- PWA Support - Installable mobile-friendly application experience.

## Success Metrics
- Successfully creating and managing Prizes.
- Successfully creating and completing Bounties.
- Accurate handling of recurring tasks (resetting completion status based on defined days).
- Complete multi-user data isolation where no account can read or write another account's resources.
- Awarding compounding daily milestone bonuses correctly upon task completion.
- Reverting points and milestone bonuses accurately when undoing task completion.
- Containerisation and successful deployment of the application.
- Successful generation of fake data for testing purposes using faker.js.
- Interactive SVG bar and curved trend line charts displaying productivity analytics.
- Date-grouped activity timeline linked to live task type and difficulty metadata.

## Core Principles & Gamification Rules

### Compounding Daily Bonus Milestones
To drive daily engagement, users earn extra bonus points for crossing specific thresholds of base points earned in a single day:
- **2,000 Points**: +300 bonus points
- **3,000 Points**: +500 bonus points
- **4,000 Points**: +1,000 bonus points
- **5,000 Points**: +2,000 bonus points
These bonuses are compounding. For example, earning 5,000 points in a single day rewards a total of 3,800 bonus points (+300 + 500 + 1,000 + 2,000). The bonus points themselves do not count towards the earned point thresholds.

### Task Undo (Uncompletion)
Users can mark a completed task as incomplete (undo). This will:
- Revert the task status to incomplete.
- Deduct the points originally earned for completing the task.
- Deduct any daily milestone bonuses that were unlocked as a result of those points.

### Recurrence Rules
Bounties can be configured as recurring tasks by specifying the days of the week they should reset. The server automatically checks and resets these tasks based on the user's local timezone.

### Focus-Oriented Sorting Rules
To help users focus on active goals, the UI enforces the following sorting rules:
- **Tasks**: Uncompleted tasks are pinned to the top (sorted by creation date, latest first). Completed tasks are pushed to the bottom (sorted by completion date, latest first).
- **Rewards**: Available/unclaimed rewards are prioritized at the top (sorted by creation date, latest first). Claimed rewards are pushed to the bottom (sorted by claim date, latest first).

## User Flow

### Core loop
- User registers a new account or enters credentials to sign in.
- Application issues a JWT access token for secure session management.
- User creates a Prize.
- User completes Bounties for points.
- Application updates the user's point balance.
- User buys a Prize with points.

## Milestones

| Milestone | Description |
| :--- | :--- |
| **M1** | Adding rules, agents, project specifications, and defining the MVP architecture. |
| **M2** | Setting up PostgreSQL with Docker and migrating schema using Alembic. |
| **M3** | Implementing password-based authentication using FastAPI and secure hashed password validation. |
| **M4** | Creating CRUD operations for Rewards and Tasks based on the user flow and DB schema. |
| **M5** | Building the Next.js dashboard interface with progress tracking and reward cards. |
| **M6** | Configuring the application as a PWA with installable support and responsive layouts. |
| **M7** | Implementing faker.js scripts and Docker Compose setup for local development and testing. |
| **M8** | Writing integration tests using pytest and TestClient for all APIs and flows. |
| **M9** | Re-architecting database models, services, and API layers to support robust multi-user isolation with schema migration. |
| **M10** | Implementing timezone-aware Task Analytics API, comprehensive backend tests, and a premium interactive frontend dashboard. |