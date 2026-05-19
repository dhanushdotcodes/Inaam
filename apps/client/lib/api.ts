import { getToken } from "./auth";
import type {
  ApiResponse,
  LoginResponse,
  LoginRequest,
  UserSignupRequest,
  UserResponse,
  Reward,
  RewardCreatePayload,
  RewardUpdatePayload,
  Task,
  TaskCreatePayload,
  TaskUpdatePayload,
  PointTransaction,
  TransactionCreatePayload,
} from "@/types";

/**
 * Base URL for the FastAPI server.
 * Falls back to localhost for local development.
 */
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

const API_PREFIX = "/api/v1";

/**
 * Generic fetch wrapper that handles JSON parsing and error extraction
 * from the standardized ApiResponse envelope.
 */
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}${API_PREFIX}${normalizedPath}`;
  const token = getToken();

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.detail ||
      errorBody?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  const json: ApiResponse<T> = await response.json();

  if (json.error) {
    throw new Error(json.error);
  }

  return json.data as T;
}

/**
 * Log in a user with email and password.
 * Returns a LoginResponse with the access token and user info on success.
 */
export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const url = `${BASE_URL}${API_PREFIX}/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.detail ||
      errorBody?.message ||
      `Login failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * Register a new user with username, email, and password.
 * Returns the created UserResponse on success.
 */
export async function signupUser(
  payload: UserSignupRequest
): Promise<UserResponse> {
  return apiFetch<UserResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch all tasks across all rewards.
 */
export async function getAllTasks(): Promise<Task[]> {
  const tzOffset = -new Date().getTimezoneOffset();
  return apiFetch<Task[]>(`/tasks?tz_offset=${tzOffset}`);
}

/**
 * Fetch all tasks for a specific reward.
 */
export async function getRewardTasks(rewardId: string): Promise<Task[]> {
  return apiFetch<Task[]>(`/rewards/${rewardId}/tasks`);
}

/**
 * Create a new standalone task.
 */
export async function createTask(
  payload: TaskCreatePayload
): Promise<Task> {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Create a new task linked to a specific reward.
 */
export async function createRewardTask(
  rewardId: string,
  payload: TaskCreatePayload
): Promise<Task> {
  return apiFetch<Task>(`/rewards/${rewardId}/task`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a specific task.
 */
export async function updateTask(
  taskId: string,
  payload: TaskUpdatePayload,
  rewardId?: string | null
): Promise<Task> {
  const path = rewardId ? `/rewards/${rewardId}/task/${taskId}` : `/tasks/${taskId}`;
  return apiFetch<Task>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Complete a specific task.
 */
export async function completeTask(
  taskId: string,
  rewardId?: string | null
): Promise<Task> {
  const tzOffset = -new Date().getTimezoneOffset();
  const path = rewardId 
    ? `/rewards/${rewardId}/task/${taskId}/complete?tz_offset=${tzOffset}` 
    : `/tasks/${taskId}/complete?tz_offset=${tzOffset}`;
  return apiFetch<Task>(path, {
    method: "PATCH",
  });
}

/**
 * Uncomplete/revert a specific task.
 */
export async function incompleteTask(
  taskId: string,
  rewardId?: string | null
): Promise<Task> {
  const path = rewardId 
    ? `/rewards/${rewardId}/task/${taskId}/incomplete` 
    : `/tasks/${taskId}/incomplete`;
  return apiFetch<Task>(path, {
    method: "PATCH",
  });
}

/**
 * Delete a specific task.
 */
export async function deleteTask(
  taskId: string,
  rewardId?: string | null
): Promise<boolean> {
  const path = rewardId ? `/rewards/${rewardId}/task/${taskId}` : `/tasks/${taskId}`;
  return apiFetch<boolean>(path, {
    method: "DELETE",
  });
}

/**
 * Fetch all rewards.
 */
export async function getRewards(status?: "claimed" | "unclaimed"): Promise<Reward[]> {
  const path = status ? `/rewards?status=${status}` : "/rewards";
  return apiFetch<Reward[]>(path);
}

/**
 * Create a new reward.
 */
export async function createReward(
  payload: RewardCreatePayload
): Promise<Reward> {
  return apiFetch<Reward>("/rewards", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a specific reward.
 */
export async function updateReward(
  rewardId: string,
  payload: RewardUpdatePayload
): Promise<Reward> {
  return apiFetch<Reward>(`/rewards/${rewardId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a specific reward.
 */
export async function deleteReward(rewardId: string): Promise<boolean> {
  return apiFetch<boolean>(`/rewards/${rewardId}`, {
    method: "DELETE",
  });
}

/**
 * Claim a specific reward.
 */
export async function claimReward(rewardId: string): Promise<Reward> {
  return apiFetch<Reward>(`/rewards/${rewardId}/claim`, {
    method: "PATCH",
  });
}

/**
 * Fetch current total points balance.
 */
export async function getPoints(): Promise<number> {
  return apiFetch<number>("/points");
}

/**
 * Fetch all point transactions.
 */
export async function getTransactions(): Promise<PointTransaction[]> {
  return apiFetch<PointTransaction[]>("/transactions");
}

/**
 * Create a new manual transaction (bonus/penalty).
 */
export async function createTransaction(
  payload: TransactionCreatePayload
): Promise<PointTransaction> {
  return apiFetch<PointTransaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
