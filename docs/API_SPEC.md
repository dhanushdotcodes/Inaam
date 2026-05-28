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

## Prize management
---
All operations are isolated and scoped to the authenticated user.
- `GET /api/v1/rewards` - get all prizes for the authenticated user
- `POST /api/v1/rewards` - create a new prize for the authenticated user
- `GET /api/v1/rewards/{id}` - get a specific prize owned by the user
- `PUT /api/v1/rewards/{id}` - update a specific prize owned by the user
- `DELETE /api/v1/rewards/{id}` - delete a specific prize owned by the user
- `PATCH /api/v1/rewards/{id}/claim` - claim a prize owned by the user
- `GET /api/v1/rewards?status=claimed` - get claimed rewards for the authenticated user
- `GET /api/v1/rewards?status=unclaimed` - get unclaimed rewards for the authenticated user

## Task management (Bounties)
---
All tasks are isolated and scoped to the authenticated user.

- `GET /api/v1/tasks` - Get all tasks (bounties) for the user.
  - **Query Parameters**:
    - `tz_offset`: (Optional integer, default: `0`) User timezone offset in minutes, used to filter active/reset tasks for today.
- `POST /api/v1/tasks` - Create a new task (bounty) for the user.
- `PUT /api/v1/tasks/{id}` - Update a specific task (bounty).
- `DELETE /api/v1/tasks/{id}` - Delete a specific task (bounty).
- `PATCH /api/v1/tasks/{id}/complete` - Complete a specific task and grant points.
  - **Query Parameters**:
    - `tz_offset`: (Optional integer, default: `0`) User timezone offset in minutes, used for daily reset and milestone tracking.
- `PATCH /api/v1/tasks/{id}/incomplete` - Uncomplete/revert a specific task. Deducts the task points and any milestone bonuses earned because of it.

### Task Analytics
- `GET /api/v1/tasks/analytics` - Fetch daily completion counts and metrics aggregated by local timezone offset.
  - **Query Parameters**:
    - `days`: (Required integer, values: `7`, `14`, or `30`) Number of days of historical data to compile.
    - `tz_offset`: (Optional integer, default: `0`) User's local timezone offset in minutes (e.g., `330` for UTC+5:30) to compute calendar date boundaries.
  - **Response Envelope**:
    ```json
    {
      "data": {
        "total_days": 7,
        "completed_data": {
          "day_1": {
            "completed_tasks": 0,
            "date": "2026-05-16",
            "day_label": "Day 1"
          },
          ...
          "day_7": {
            "completed_tasks": 3,
            "date": "2026-05-22",
            "day_label": "Day 7"
          }
        }
      },
      "error": null,
      "message": "success"
    }
    ```


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