# API Specification
---
Base URL: /api/v1

All endpoints return JSON responses:
```
{
  "data": {},
  "error": null,
  "message": "success"
}
```
Error response:
```
{
  "data": null,
  "error": "VALIDATION_ERROR",
  "message": "Email is required"
}
```

## Authentication & Context
---
All requests (except `/auth/login`, `/auth/signup`, and `/health`) must include a valid JWT Bearer token in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_access_token>
```
Endpoints perform resource CRUD operations in the context of the authenticated user. A user cannot view, modify, or delete resources belonging to other users.

### Authentication Endpoints
- `POST /api/v1/auth/signup` - Register a new user account (returns user details).
- `POST /api/v1/auth/login` - Sign in and get a JWT access token (returns `access_token` and user details).
- `GET /api/v1/health` - Public health check.

## Quest and Prize management
---
All operations are isolated and scoped to the authenticated user.
- `GET /api/v1/rewards` - get all quests and prizes for the authenticated user
- `POST /api/v1/rewards` - create a new quest or prize for the authenticated user
- `GET /api/v1/rewards/{id}` - get a specific reward owned by the user
- `PUT /api/v1/rewards/{id}` - update a specific reward owned by the user
- `DELETE /api/v1/rewards/{id}` - delete a specific reward owned by the user
- `PATCH /api/v1/rewards/{id}/claim` - claim a quest or prize owned by the user
- `GET /api/v1/rewards?status=claimed` - get claimed rewards for the authenticated user
- `GET /api/v1/rewards?status=unclaimed` - get unclaimed rewards for the authenticated user

## Task management (Bounties & Objectives)
---
All tasks are isolated and scoped to the authenticated user.

### Independent Tasks (Bounties)
- `GET /api/v1/tasks` - Get all tasks (both bounties and objectives) for the user.
  - **Query Parameters**:
    - `tz_offset`: (Optional integer, default: `0`) User timezone offset in minutes, used to filter active/reset tasks for today.
- `POST /api/v1/tasks` - Create a new independent task (bounty) for the user.
- `PUT /api/v1/tasks/{id}` - Update a specific independent task (bounty).
- `DELETE /api/v1/tasks/{id}` - Delete a specific independent task (bounty).
- `PATCH /api/v1/tasks/{id}/complete` - Complete a specific independent task and grant points.
  - **Query Parameters**:
    - `tz_offset`: (Optional integer, default: `0`) User timezone offset in minutes, used for daily reset and milestone tracking.
- `PATCH /api/v1/tasks/{id}/incomplete` - Uncomplete/revert a specific independent task. Deducts the task points and any milestone bonuses earned because of it.

### Quest-Linked Tasks (Objectives)
- `GET /api/v1/rewards/{id}/tasks` - Get all objectives for a specific quest owned by the user.
- `POST /api/v1/rewards/{id}/task` - Create a new objective for a specific quest.
- `GET /api/v1/rewards/{id}/task/{task_id}` - Get a specific objective task.
- `PUT /api/v1/rewards/{id}/task/{task_id}` - Update a specific objective task.
- `DELETE /api/v1/rewards/{id}/task/{task_id}` - Delete a specific objective task.
- `PATCH /api/v1/rewards/{id}/task/{task_id}/complete` - Complete a specific objective task and grant points.
  - **Query Parameters**:
    - `tz_offset`: (Optional integer, default: `0`) User timezone offset in minutes, used for milestone tracking.
- `PATCH /api/v1/rewards/{id}/task/{task_id}/incomplete` - Uncomplete/revert a specific objective task. Deducts the task points and any milestone bonuses earned because of it.

## Points and Transactions
---
Calculations and transaction ledgers are isolated and scoped to the authenticated user.
- `GET /api/v1/points` - Get current points balance for the authenticated user.
- `GET /api/v1/transactions` - Get point transaction history for the authenticated user.
- `POST /api/v1/transactions` - Manually add a bonus or penalty transaction for the authenticated user.

### Compounding Daily Milestone Bonuses
Task completion endpoints (`/complete`) automatically evaluate the total base points earned today (scoped to the user's local date using `tz_offset`). Crossing the following daily thresholds triggers automatic, compounding bonus transactions:
- **2,000 Points Milestone**: Awards `+300` bonus points (type: `BONUS`, description: `Daily Milestone: 2,000 Points Reached!`)
- **3,000 Points Milestone**: Awards `+500` bonus points (type: `BONUS`, description: `Daily Milestone: 3,000 Points Reached!`)
- **4,000 Points Milestone**: Awards `+1,000` bonus points (type: `BONUS`, description: `Daily Milestone: 4,000 Points Reached!`)
- **5,000 Points Milestone**: Awards `+2,000` bonus points (type: `BONUS`, description: `Daily Milestone: 5,000 Points Reached!`)

*Note: BONUS points are excluded when computing daily earned point thresholds. If a task is uncompleted via `/incomplete`, the associated points are deducted, and any daily milestone bonuses unlocked as a result of that task's completion are automatically deleted.*