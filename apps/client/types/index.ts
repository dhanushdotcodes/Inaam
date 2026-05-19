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
 * Task Difficulty levels.
 */
export enum TaskDifficulty {
  TINY = "TINY",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  EXTREME = "EXTREME",
}

/**
 * Task Type.
 */
export enum TaskType {
  BOUNTY = "BOUNTY",
  OBJECTIVE = "OBJECTIVE",
}

/**
 * Reward Type.
 */
export enum RewardType {
  QUEST = "QUEST",
  PRIZE = "PRIZE",
}

/**
 * Reward entity.
 * Mirrors the backend `RewardResponse` schema from `apps/server/schemas/reward.py`.
 */
export interface Reward {
  id: string;
  title: string;
  description: string | null;
  reward_type: RewardType;
  cost_points: number;
  claimed_at: string | null;
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
  description: string | null;
  task_type: TaskType;
  difficulty: TaskDifficulty;
  points: number;
  completed: boolean;
  completed_at: string | null;
  reward_id: string | null;
  is_recurring: boolean;
  recurrence_days: string | null;
  active_today?: boolean;
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
  reward_type?: RewardType;
  cost_points?: number;
}

/**
 * Payload for creating a new task.
 */
export interface TaskCreatePayload {
  title: string;
  description?: string;
  task_type?: TaskType;
  difficulty?: TaskDifficulty;
  points?: number;
  reward_id?: string | null;
  is_recurring?: boolean;
  recurrence_days?: string | null;
}

/**
 * Payload for updating a reward.
 */
export interface RewardUpdatePayload {
  title?: string;
  description?: string;
  reward_type?: RewardType;
  cost_points?: number;
  claimed_at?: string | null;
}

/**
 * Payload for updating a task.
 */
export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  task_type?: TaskType;
  difficulty?: TaskDifficulty;
  points?: number;
  completed?: boolean;
  reward_id?: string | null;
  is_recurring?: boolean;
  recurrence_days?: string | null;
}

/**
 * Reward with its tasks and UI loading state.
 */
export interface RewardWithTasks extends Reward {
  tasks: Task[];
  tasksLoading: boolean;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
}

export interface UserSignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}


/**
 * Transaction Type.
 */
export enum TransactionType {
  EARNED = "EARNED",
  SPENT = "SPENT",
  BONUS = "BONUS",
  PENALTY = "PENALTY",
}

/**
 * Point Transaction entity.
 */
export interface PointTransaction {
  id: string;
  type: TransactionType;
  points: number;
  description: string;
  task_id: string | null;
  reward_id: string | null;
  created_at: string;
}

/**
 * Payload for creating a manual transaction.
 */
export interface TransactionCreatePayload {
  type: TransactionType;
  points: number;
  description: string;
  task_id?: string | null;
  reward_id?: string | null;
}

