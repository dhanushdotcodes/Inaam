# Database Schema
---
## Core Tables
---

tasks

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier for the task |
| title | varchar | | Task Title
| completed | boolean | | Task completion status
| reward_id | uuid | Foreign Key | Link to parent reward |
| created_at | timestamp | | Task creation timestamp |
| updated_at | timestamp | | Task last updated timestamp |

---
rewards
---

| Column | Type | Notes | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | Primary Key | Unique identifier for the reward |
| title | varchar | | Reward Title
| description | varchar | Optional | Optional reward description
| claimed | boolean | | Reward claim status |
| created_at | timestamp | | Reward creation timestamp |
| updated_at | timestamp | | Reward last updated timestamp |
