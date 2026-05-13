# Product Requirements Document

## Inaam

Inaam helps me unlock rewards by completing a list of associated tasks in a simple and installable web application.

## Core Modules
- Authentication Management - Password based access using a stored hashed password.
- Reward Management - Add, Edit, Delete Quests (task-based) and Prizes (economy-based).
- Task Management - Add, Edit, Delete Bounties (independent) and Objectives (linked to Quests).
- Progress Tracking - Track completion percentage and Quest eligibility.
- Points Tracking - Earn points from Bounties and Objectives to spend on Prizes.
- PWA Support - Installable mobile-friendly application experience.

## Success Metrics
- Successfully creating and managing Quests and Prizes.
- Successfully creating and completing Bounties and Objectives.
- Correct calculation of Quest progress percentage.
- Correctly identifying claimable Quests after Objective completion.
- Containerisation and successful deployment of the application.
- Successful generation of fake data for testing purposes using faker.js.

## User Flow

### Core loop
- User enters the password to access the application.
- User creates a Quest or a Prize.
- User adds Objectives to a Quest or completes Bounties for points.
- User completes tasks progressively.
- Application updates the Quest completion percentage.
- User unlocks and claims the Quest after completing all Objectives, or buys a Prize with points.

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