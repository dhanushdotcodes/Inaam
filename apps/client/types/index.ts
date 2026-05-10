/**
 * Generic API response wrapper.
 * Mirrors the backend `ApiResponse` schema from `apps/server/schemas/base.py`.
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message: string;
}

/**
 * Reward entity.
 * Mirrors the backend `RewardResponse` schema from `apps/server/schemas/reward.py`.
 */
export interface Reward {
  id: string;
  title: string;
  description: string | null;
  claimed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Task entity.
 * Mirrors the backend `TaskResponse` schema from `apps/server/schemas/task.py`.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  reward_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating a new reward.
 * Mirrors the backend `RewardCreate` schema.
 */
export interface RewardCreatePayload {
  title: string;
  description?: string;
}

/**
 * Payload for creating a new task.
 */
export interface TaskCreatePayload {
  title: string;
}

/**
 * Reward with its tasks and UI loading state.
 */
export interface RewardWithTasks extends Reward {
  tasks: Task[];
  tasksLoading: boolean;
}

/**
 * Login response from the auth endpoint.
 * Mirrors the backend `LoginResponse` schema from `apps/server/schemas/auth.py`.
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

