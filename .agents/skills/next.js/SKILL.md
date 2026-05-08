----
name: next.js
description: Build Next.js pages, components, and API integrations using the App Router, TypeScript, React 19, and Tailwind CSS v4 within the project's frontend architecture.
----

# Skill: Building Next.js Frontend Features

## When to Use
Use this skill when:
- Creating a new page or route in the Next.js App Router.
- Building reusable React components.
- Integrating the frontend with the FastAPI backend via API calls.
- Adding layouts, loading states, error boundaries, or metadata to pages.
- Creating TypeScript type definitions for API responses or component props.
- Implementing client-side form handling, validation, or state management.

Do NOT use when:
- Building or modifying backend API endpoints (use `fastapi-api` instead).
- Working with database models or migrations (use `handle-db` instead).
- Writing backend tests (use `fastapi-server-tests` instead).
- Doing Docker or infrastructure work (use `containerise-app` instead).

---

## Input
- Stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, Bun.
- Architecture: App Router with `app/` directory for pages and `components/` for reusable UI.
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`.
- Path alias: `@/*` maps to the project root (`apps/client/*`).
- Fonts: Geist Sans and Geist Mono via `next/font/google`.
- Backend: FastAPI server at `http://localhost:8000/api/v1`.

---

## Constraints and Guidelines

### Naming Conventions
- Route folders MUST use lowercase or `kebab-case` (e.g., `app/dashboard/`, `app/forgot-password/`).
- Component files MUST use `PascalCase` and match the component name (e.g., `RewardCard.tsx` exports `RewardCard`).
- Functions and variables MUST use `camelCase`.
- Hooks MUST follow the `useSomething` pattern.
- Types and Interfaces MUST use `PascalCase`.
- Constants MUST use `UPPER_SNAKE_CASE`.
- Use `interface` for object shapes and `type` for unions/intersections.

### Architecture Rules
- Pages live in `app/` using the App Router convention (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Reusable components live in `components/` at the project root level.
- API client functions and utility helpers live in `lib/`.
- TypeScript type definitions live in `types/`.
- Static assets live in `public/`.
- Server Components are the default — use `"use client"` only when the component needs interactivity, hooks, or browser APIs.
- NEVER fetch data in Client Components when a Server Component can do it.
- ALL components MUST have typed props using `interface`.

### Styling Rules
- Use Tailwind CSS v4 utility classes for all styling.
- Avoid inline `style` attributes unless dynamically computed.
- Use CSS variables defined in `globals.css` for design tokens (colors, spacing, fonts).
- Ensure all interactive elements have proper hover/focus/active states.

### Security
- NEVER expose backend secrets or server-side tokens in client-side code.
- Use environment variables prefixed with `NEXT_PUBLIC_` only for values safe to expose to the browser.
- Sanitize and validate all user inputs before sending to the backend.

### Dependencies
- NEVER add a new external dependency without asking the user first.
- Prefer built-in Next.js features (Image, Link, Font, Metadata API) over third-party alternatives.

---

## Project Structure

```text
apps/client/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, global providers)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles and Tailwind directives
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── dashboard/
│       └── page.tsx            # Dashboard page
├── components/
│   ├── RewardCard.tsx          # Reward display card component
│   ├── TaskItem.tsx            # Individual task list item component
│   ├── ProgressBar.tsx         # Progress indicator component
│   └── LoginForm.tsx           # Login form with validation
├── lib/
│   ├── api.ts                  # API client (fetch wrapper for backend)
│   └── utils.ts                # Shared utility functions
├── types/
│   └── index.ts                # Shared TypeScript type definitions
├── public/
│   └── ...                     # Static assets (images, icons)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS + Tailwind config
└── package.json                # Dependencies and scripts
```

---

## Steps to Execute

1. **Clarify the requirement**
   - Identify the page, component, or feature to build.
   - Confirm the data requirements — does it need backend API data?
   - Determine if the component is a Server Component or Client Component.
   - Check if relevant TypeScript types already exist in `types/`.

2. **Define TypeScript types**
   - Add or update type definitions in `types/` for API responses, component props, and form data.
   - Use `interface` for object shapes and `type` for unions/intersections.
   - Example:
     ```typescript
     interface Reward {
       id: string;
       title: string;
       points: number;
       isRedeemed: boolean;
     }
     ```

3. **Build the API client (if needed)**
   - Add fetch functions in `lib/api.ts` that call the FastAPI backend.
   - Use the `NEXT_PUBLIC_API_URL` environment variable for the base URL.
   - Handle errors explicitly — throw on non-OK responses with the status and body.
   - Return typed responses.
   - Example:
     ```typescript
     const API_BASE = process.env.NEXT_PUBLIC_API_URL;

     export async function getRewards(): Promise<Reward[]> {
       const res = await fetch(`${API_BASE}/rewards`);
       if (!res.ok) {
         throw new Error(`Failed to fetch rewards: ${res.status}`);
       }
       return res.json();
     }
     ```

4. **Create the component**
   - Place reusable components in `components/` with `PascalCase` filenames.
   - Define typed props via an `interface`.
   - Use `"use client"` only if the component needs interactivity.
   - Apply Tailwind CSS classes for styling.
   - Example:
     ```tsx
     interface RewardCardProps {
       reward: Reward;
       onRedeem: (id: string) => void;
     }

     export default function RewardCard({ reward, onRedeem }: RewardCardProps) {
       return (
         <div className="rounded-lg border p-4 shadow-sm">
           <h3 className="text-lg font-semibold">{reward.title}</h3>
           <p className="text-sm text-gray-500">{reward.points} pts</p>
           <button
             onClick={() => onRedeem(reward.id)}
             disabled={reward.isRedeemed}
             className="mt-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
           >
             Redeem
           </button>
         </div>
       );
     }
     ```

5. **Create or update the page**
   - Add `page.tsx` inside the appropriate `app/<route>/` directory.
   - Use Server Components for data fetching when possible.
   - Export `metadata` for SEO (title, description).
   - Compose the page from components defined in `components/`.
   - Example:
     ```tsx
     import { Metadata } from "next";
     import RewardCard from "@/components/RewardCard";
     import { getRewards } from "@/lib/api";

     export const metadata: Metadata = {
       title: "Dashboard | Inaam",
       description: "View your rewards and tasks",
     };

     export default async function DashboardPage() {
       const rewards = await getRewards();
       return (
         <main className="mx-auto max-w-4xl p-6">
           <h1 className="mb-6 text-2xl font-bold">Your Rewards</h1>
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
             {rewards.map((r) => (
               <RewardCard key={r.id} reward={r} onRedeem={() => {}} />
             ))}
           </div>
         </main>
       );
     }
     ```

6. **Update layout if needed**
   - If the new page needs shared UI (nav, sidebar, footer), update or create a `layout.tsx` in the relevant route segment.
   - The root layout (`app/layout.tsx`) handles global fonts, metadata, and providers.

7. **Validate**
   - Start the dev server: `cd apps/client && bun run dev`
   - Visit the page in the browser and verify rendering, responsiveness, and interactivity.
   - Check the terminal for TypeScript or build errors.
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
- TypeScript types in `types/`.
- API client functions in `lib/api.ts`.
- React components in `components/` with `PascalCase` filenames.
- Page files in `app/<route>/page.tsx`.
- Brief explanation of Server vs Client Component decisions.

---

## Suggested Next Skills
- `fastapi-api` — if the page needs a backend endpoint that doesn't exist yet.
- `fastapi-server-tests` — to test the backend endpoints this page consumes.
- `execution` — if this is part of a larger implementation plan.

---

## Checklist
- [ ] Component file uses `PascalCase` and matches the exported component name
- [ ] Props are typed with an `interface`
- [ ] `"use client"` is only added when the component genuinely needs it
- [ ] API calls use the centralized `lib/api.ts` client
- [ ] Environment variables use the `NEXT_PUBLIC_` prefix for client-safe values
- [ ] Page exports `metadata` for SEO
- [ ] Tailwind CSS classes are used for all styling
- [ ] No hardcoded API URLs — config or env vars are used
- [ ] Naming conventions follow project rules (kebab-case routes, PascalCase components, camelCase functions)
- [ ] Page renders correctly on the dev server with no console errors
