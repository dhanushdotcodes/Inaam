# Database Schema
---
## Core Tables
---

### users

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier for the user |
| username | varchar | Unique, Indexed | User's username |
| email | varchar | Unique, Indexed | User's email address |
| hashed_password | varchar | | Hashed password |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |

---

### rewards

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier for the reward |
| user_id | uuid | Foreign Key, Non-Nullable, Cascade | Link to owner user (users.id) |
| title | varchar | | Reward Title |
| description | varchar | Optional | Reward description |
| cost_points | integer | Default: 0 | Points required for PRIZE rewards |
| claimed_at | timestamp | Optional | When the reward was claimed |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |

---

### tasks

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier for the task |
| user_id | uuid | Foreign Key, Non-Nullable, Cascade | Link to owner user (users.id) |
| title | varchar | | Task Title |
| description | varchar | Optional | Task description |
| difficulty | varchar | Enum: TINY, SMALL, MEDIUM, HARD, EXTREME | Energy level cost |
| points | integer | Default: 0 | Points earned upon completion |
| completed | boolean | | Task completion status |
| completed_at | timestamp | Optional | When the task was completed |
| is_recurring | boolean | Default: false, Non-Nullable | Whether the task is recurring |
| recurrence_days | varchar | Optional | Days of the week task repeats (e.g., '0,2,4' for Mon,Wed,Fri) |
| pinned | boolean | Default: false, Non-Nullable | Whether the task is pinned to the dashboard |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |

---

### point_transactions

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier |
| user_id | uuid | Foreign Key, Non-Nullable, Cascade | Link to owner user (users.id) |
| type | varchar | Enum: EARNED, SPENT, BONUS, PENALTY | Transaction type |
| points | integer | | Number of points |
| task_id | uuid | Foreign Key, Nullable | Associated task |
| reward_id | uuid | Foreign Key, Nullable | Associated reward |
| description | varchar | | Transaction description |
| created_at | timestamp | | Creation timestamp |

---

## Task Analytics Tracking Logic

For compiling historical daily task completion statistics, queries MUST leverage the `point_transactions` table instead of the `tasks` table.

### Rationale
- **Recurring Tasks**: Recurring tasks automatically reset daily (setting `completed = False` and `completed_at = None`), which would otherwise erase their completion history if we only queried the `tasks` table.
- **Task Deletions**: Deleting a task deletes its record from the `tasks` table entirely.
- **Ledger-based Querying**: By querying `point_transactions` for entries where `type = 'EARNED'` (filtering by `task_id` and the user's timezone-shifted `created_at`), we maintain a permanent ledger of every task completion. This guarantees accurate, zero-filled historical metrics.

