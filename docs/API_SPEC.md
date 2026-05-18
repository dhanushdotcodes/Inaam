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
- `GET /api/v1/tasks` - get all tasks (both bounties and objectives) for the user
- `GET /api/v1/rewards/{id}/tasks` - get objectives for a specific quest owned by the user
- `POST /api/v1/rewards/{id}/task` - create a new objective for a quest owned by the user
- `GET /api/v1/rewards/{id}/task/{id}` - get a specific task
- `PUT /api/v1/rewards/{id}/task/{id}` - update a specific task
- `DELETE /api/v1/rewards/{id}/task/{id}` - delete a specific task
- `PATCH /api/v1/rewards/{id}/task/{id}/complete` - complete a specific task and grant points

## Points and Transactions
---
Calculations and transaction ledgers are isolated and scoped to the authenticated user.
- `GET /api/v1/points` - get current points balance for the authenticated user
- `GET /api/v1/transactions` - get point transaction history for the authenticated user
- `POST /api/v1/transactions` - manually add a bonus or penalty transaction for the authenticated user