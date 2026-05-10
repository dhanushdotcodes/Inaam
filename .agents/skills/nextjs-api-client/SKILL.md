----
name: nextjs-api-client
description: Build API client functions, TypeScript type definitions, and client-side form handling for integrating the Next.js frontend with the FastAPI backend.
----

# Skill: Building API Client & Type Definitions

## When to Use
Use this skill when:
- Adding fetch functions in `lib/api.ts` to call the FastAPI backend.
- Defining TypeScript type definitions in `types/` for API responses, request payloads, or form data.
- Building client-side form handling with validation and state management.
- Adding utility functions in `lib/` for data transformation or formatting.

Do NOT use when:
- Creating a new page or route (use `nextjs-page` instead).
- Building a new reusable UI component (use `nextjs-component` instead).
- Building or modifying backend API endpoints (use `fastapi-api` instead).
- Working with database models or migrations (use `handle-db` instead).
- Writing backend tests (use `fastapi-server-tests` instead).

---

## Input
- Stack: Next.js 16, React 19, TypeScript 5, Bun.
- Backend: FastAPI server at `http://localhost:8000/api/v1`.
- Environment variable: `NEXT_PUBLIC_SERVER_URL` for the backend base URL.
- Path alias: `@/*` maps to the project root (`apps/client/*`).

---

## Constraints and Guidelines

### Naming Conventions
- Functions and variables MUST use `camelCase` (e.g., `getRewards`, `createTask`).
- Types and Interfaces MUST use `PascalCase` (e.g., `Reward`, `TaskCreatePayload`).
- Constants MUST use `UPPER_SNAKE_CASE` (e.g., `API_BASE`).
- Use `interface` for object shapes (API responses, form data).
- Use `type` for unions and intersections.

### Architecture Rules
- API client functions live in `lib/api.ts`.
- **Standardized Fetch**: Use a wrapper function like `apiFetch` to centralize:
  - Base URL configuration.
  - Authentication headers (JWT).
  - Error handling and response parsing.
- Utility helpers live in `lib/utils.ts`.
- TypeScript type definitions live in `types/index.ts`.
- ALL fetch functions MUST return typed responses.
- ALL fetch functions MUST handle errors explicitly — throw on non-OK responses.
- Use the `NEXT_PUBLIC_SERVER_URL` environment variable for the base URL.

### Security
- NEVER expose backend secrets or server-side tokens in client-side code.
- Use environment variables prefixed with `NEXT_PUBLIC_` only for values safe to expose to the browser.
- Sanitize and validate all user inputs before sending to the backend.

### Dependencies
- NEVER add a new external dependency without asking the user first.
- Use the built-in `fetch` API — do not use `axios` or other HTTP clients unless explicitly requested.

---

## Project Structure (Relevant Subset)

```text
apps/client/
├── lib/
│   ├── api.ts                  # API client (fetch wrapper for backend)
│   └── utils.ts                # Shared utility functions
├── types/
│   └── index.ts                # Shared TypeScript type definitions
└── .env                        # Environment variables (NEXT_PUBLIC_SERVER_URL)
```

---

## Steps to Execute

1. **Clarify the integration requirement**
   - Identify the backend endpoint(s) to integrate (method, path, request/response shape).
   - Confirm the endpoint exists — if not, use the `fastapi-api` skill first.
   - Determine if the integration also needs form handling or is purely data fetching.

2. **Define TypeScript types**
   - Add or update type definitions in `types/index.ts` for API responses, request payloads, and form data.
   - Use `interface` for object shapes and `type` for unions/intersections.
   - Example:
     ```typescript
     // types/index.ts

     export interface Reward {
       id: string;
       title: string;
       description?: string;
       claimed: boolean;
     }

     export interface RewardCreatePayload {
       title: string;
       description?: string;
     }

     export interface Task {
       id: string;
       reward_id: string;
       title: string;
       completed: boolean;
     }
     ```

3. **Build the API client functions**
   - Add fetch functions in `lib/api.ts` that call the FastAPI backend.
   - Use the `apiFetch` standardized wrapper.
   - Example:
     ```typescript
     // lib/api.ts

     const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL;

     async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
       const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
       
       const headers: HeadersInit = {
         "Content-Type": "application/json",
         ...(token && { Authorization: `Bearer ${token}` }),
         ...options.headers,
       };

       const res = await fetch(`${API_BASE}/api/v1${endpoint}`, { ...options, headers });
       
       if (!res.ok) {
         const error = await res.text();
         throw new Error(error || `Request failed with status ${res.status}`);
       }

       return res.json();
     }

     export async function getRewards(): Promise<Reward[]> {
       return apiFetch<Reward[]>("/rewards");
     }

     export async function updateReward(id: string, payload: Partial<Reward>): Promise<Reward> {
       return apiFetch<Reward>(`/rewards/${id}`, {
         method: "PUT",
         body: JSON.stringify(payload),
       });
     }

     export async function deleteReward(id: string): Promise<void> {
       return apiFetch<void>(`/rewards/${id}`, { method: "DELETE" });
     }
     ```

4. **Build form handling (if needed)**
   - Create form handler functions for client-side form state management.
   - Validate all inputs before sending to the backend.
   - Use React state hooks (`useState`, `useReducer`) for form state.
   - Handle loading, success, and error states.

5. **Add utility functions (if needed)**
   - Place shared helpers in `lib/utils.ts` for formatting, transformations, or validations.

6. **Validate**
   - Start the dev server: `cd apps/client && bun run dev`
   - Verify API calls succeed against the running backend.
   - Check TypeScript types are correctly inferred in consuming components/pages.
   - Verify no console errors in the browser.

---

## Build & Verify Commands

- **Run the dev server**:
  ```bash
  cd apps/client
  bun run dev
  ```
- **Run the linter**:
  ```bash
  cd apps/client
  bun run lint
  ```
- **Build for production** (only when explicitly requested):
  ```bash
  cd apps/client
  bun run build
  ```

---

## Output Format
- TypeScript type definitions in `types/index.ts`.
- API client functions in `lib/api.ts`.
- Utility functions in `lib/utils.ts` (if needed).
- Custom hooks for form handling (if needed).

---

## Suggested Next Skills
- `nextjs-component` — to build UI components that consume the API data or render forms.
- `nextjs-page` — to wire API data into a page.
- `fastapi-api` — if the backend endpoint doesn't exist yet.
- `fastapi-server-tests` — to test the backend endpoints this client consumes.

---

## Checklist
- [ ] TypeScript types are defined in `types/` for all API responses and payloads
- [ ] API client functions are in `lib/api.ts` with typed return values
- [ ] Standardized `apiFetch` wrapper is used for consistency
- [ ] `NEXT_PUBLIC_SERVER_URL` environment variable is used for the base URL
- [ ] Errors are handled explicitly — non-OK responses throw with status and body
- [ ] All user inputs are validated before sending to the backend
- [ ] `interface` is used for object shapes, `type` for unions/intersections
- [ ] No backend secrets or server-side tokens are exposed in client-side code
- [ ] API calls work correctly against the running backend
