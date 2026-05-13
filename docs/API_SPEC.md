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

## Quest and Prize management
---
GET /api/v1/rewards - get all quests and prizes
POST /api/v1/rewards - create a new quest or prize
GET /api/v1/rewards/{id} - get a specific reward
PUT /api/v1/rewards/{id} - update a specific reward
DELETE /api/v1/rewards/{id} - delete a specific reward

PATCH /api/v1/rewards/{id}/claim - claim a quest or prize
GET /api/v1/rewards?status=claimed - get all claimed rewards
GET /api/v1/rewards?status=unclaimed - get all unclaimed rewards

## Task management (Bounties & Objectives)
---
GET /api/v1/tasks - get all tasks (both bounties and objectives)
GET /api/v1/rewards/{id}/tasks - get all objectives for a quest
POST /api/v1/rewards/{id}/task - create a new objective for a quest
GET /api/v1/rewards/{id}/task/{id} - get a specific task
PUT /api/v1/rewards/{id}/task/{id} - update a specific task
DELETE /api/v1/rewards/{id}/task/{id} - delete a specific task
PATCH /api/v1/rewards/{id}/task/{id}/complete - complete a specific task

## Points and Transactions
---
GET /api/v1/points - get current total points balance
GET /api/v1/transactions - get all point transactions history
POST /api/v1/transactions - manually add a bonus or penalty transaction