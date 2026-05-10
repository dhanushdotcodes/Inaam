import { getToken } from "./auth";
import type {
  ApiResponse,
  LoginResponse,
  Reward,
  RewardCreatePayload,
  RewardUpdatePayload,
  Task,
  TaskCreatePayload,
  TaskUpdatePayload,
} from "@/types";

/**
 * Base URL for the FastAPI server.
 * Falls back to localhost for local development.
 */
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const API_PREFIX = "/api/v1";

/**
 * Generic fetch wrapper that handles JSON parsing and error extraction
 * from the standardized ApiResponse envelope.
 */
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${API_PREFIX}${path}`;
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
 * Verify the secret key by calling the auth login endpoint.
 * Returns a LoginResponse with the JWT access token on success.
 * Throws an Error with the server's detail message on failure.
 */
export async function verifyKey(key: string): Promise<LoginResponse> {
  const url = `${BASE_URL}${API_PREFIX}/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.detail ||
      errorBody?.message ||
      `Verification failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * Fetch all rewards.
 */
export async function getRewards(): Promise<Reward[]> {
  return apiFetch<Reward[]>("/rewards");
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
 * Fetch all tasks for a specific reward.
 */
export async function getRewardTasks(rewardId: string): Promise<Task[]> {
  return apiFetch<Task[]>(`/rewards/${rewardId}/tasks`);
}

/**
 * Create a new task for a specific reward.
 */
export async function createTask(
  rewardId: string,
  payload: TaskCreatePayload
): Promise<Task> {
  return apiFetch<Task>(`/rewards/${rewardId}/task`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a specific task for a reward.
 */
export async function updateTask(
  rewardId: string,
  taskId: string,
  payload: TaskUpdatePayload
): Promise<Task> {
  return apiFetch<Task>(`/rewards/${rewardId}/task/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a specific task for a reward.
 */
export async function deleteTask(
  rewardId: string,
  taskId: string
): Promise<boolean> {
  return apiFetch<boolean>(`/rewards/${rewardId}/task/${taskId}`, {
    method: "DELETE",
  });
}

/**
 * Complete a specific task for a reward.
 */
export async function completeTask(
  rewardId: string,
  taskId: string
): Promise<Task> {
  return apiFetch<Task>(`/rewards/${rewardId}/task/${taskId}/complete`, {
    method: "PATCH",
  });
}
