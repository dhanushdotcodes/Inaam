# Product Requirements Document

## Inaam

Inaam helps me unlock rewards by completing a list of associated tasks in a simple and installable web application.

## Core Modules
- Authentication Management - Password based access using a stored hashed password.
- Reward Management - Add, Edit, Delete Rewards.
- Task Management - Add, Edit, Delete Tasks linked to Rewards.
- Progress Tracking - Track completion percentage and reward eligibility.
- PWA Support - Installable mobile-friendly application experience.

## Success Metrics
- Successfully creating and managing rewards.
- Successfully creating and completing tasks associated with rewards.
- Correct calculation of reward progress percentage.
- Correctly identifying claimable rewards after task completion.
- Containerisation and successful deployment of the application.
- Successful generation of fake reward and task data for testing purposes using faker.js.

## User Flow

### Core loop
- User enters the password to access the application.
- User creates a reward.
- User adds tasks associated with the reward.
- User completes tasks progressively.
- Application updates the reward completion percentage.
- User unlocks and claims the reward after completing all tasks.

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