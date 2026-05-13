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

## Authentication
---
POST /api/v1/auth/login - login
GET /api/v1/health - health check

## Reward management
---
GET /api/v1/rewards - get all rewards
POST /api/v1/rewards - create a new reward
GET /api/v1/rewards/{id} - get a specific reward
PUT /api/v1/rewards/{id} - update a specific reward
DELETE /api/v1/rewards/{id} - delete a specific reward

PATCH /api/v1/rewards/{id}/claim - claim a reward
GET /api/v1/rewards?status=claimed - get all claimed rewards
GET /api/v1/rewards?status=unclaimed - get all unclaimed rewards

## Task management
---
GET /api/v1/tasks - get all tasks
GET /api/v1/rewards/{id}/tasks - get all tasks for a reward
POST /api/v1/rewards/{id}/task - create a new task for a reward
GET /api/v1/rewards/{id}/task/{id} - get a specific task
PUT /api/v1/rewards/{id}/task/{id} - update a specific task
DELETE /api/v1/rewards/{id}/task/{id} - delete a specific task
PATCH /api/v1/rewards/{id}/task/{id}/complete - complete a specific task

## Points and Transactions
---
GET /api/v1/points - get current total points balance
GET /api/v1/transactions - get all point transactions history
POST /api/v1/transactions - manually add a bonus or penalty transaction