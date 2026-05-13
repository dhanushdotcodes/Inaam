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
| title | varchar | | Reward Title |
| description | varchar | Optional | Reward description |
| reward_type | varchar | Enum: DIRECT, ECONOMY | Type of reward unlock logic |
| cost_points | integer | Default: 0 | Points required for ECONOMY rewards |
| claimed_at | timestamp | Optional | When the reward was claimed |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |

---

### tasks

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier for the task |
| title | varchar | | Task Title |
| description | varchar | Optional | Task description |
| task_type | varchar | Enum: BOUNTY, OBJECTIVE | Type of task (independent vs linked) |
| difficulty | varchar | Enum: TINY, SMALL, MEDIUM, HARD, EXTREME | Energy level cost |
| points | integer | Default: 0 | Points earned upon completion |
| completed | boolean | | Task completion status |
| completed_at | timestamp | Optional | When the task was completed |
| reward_id | uuid | Foreign Key, Nullable | Link to parent Quest |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |

---

### point_transactions

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier |
| type | varchar | Enum: EARNED, SPENT, BONUS, PENALTY | Transaction type |
| points | integer | | Number of points |
| task_id | uuid | Foreign Key, Nullable | Associated task |
| reward_id | uuid | Foreign Key, Nullable | Associated reward |
| description | varchar | | Transaction description |
| created_at | timestamp | | Creation timestamp |
