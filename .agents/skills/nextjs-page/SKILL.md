----
name: nextjs-page
description: Create and manage Next.js App Router pages, layouts, loading states, error boundaries, and SEO metadata within the project's frontend architecture.
----

# Skill: Creating Next.js Pages & Layouts

## When to Use
Use this skill when:
- Creating a new page or route in the Next.js App Router.
- Adding or updating a `layout.tsx` for shared UI (nav, sidebar, footer) in a route segment.
- Adding `loading.tsx` or `error.tsx` for loading states and error boundaries.
- Exporting `metadata` for SEO (title, description) on a page.
- Composing a page from existing reusable components.

Do NOT use when:
- Building a new reusable React component (use `nextjs-component` instead).
- Adding API client fetch functions or TypeScript types for API responses (use `nextjs-api-client` instead).
- Building or modifying backend API endpoints (use `fastapi-api` instead).
- Working with database models or migrations (use `handle-db` instead).
- Doing Docker or infrastructure work (use `containerise-app` instead).

---

## Input
- Stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, Bun.
- Architecture: App Router with `app/` directory for pages.
- Path alias: `@/*` maps to the project root (`apps/client/*`).
- Fonts: Geist Sans and Geist Mono via `next/font/google`.
- Backend: FastAPI server at `http://localhost:8000/api/v1`.

---

## Constraints and Guidelines

### Naming Conventions
- Route folders MUST use lowercase or `kebab-case` (e.g., `app/dashboard/`, `app/forgot-password/`).
- Page files follow the App Router convention: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.

### Architecture Rules
- Pages live in `app/` using the App Router convention.
- Server Components are the default — use `"use client"` only when the page genuinely needs interactivity, hooks, or browser APIs.
- NEVER fetch data in Client Components when a Server Component can do it.
- Compose pages from reusable components defined in `components/`.
- The root layout (`app/layout.tsx`) handles global fonts, metadata, and providers — avoid duplicating these in nested layouts.

### Security
- NEVER expose backend secrets or server-side tokens in client-side code.
- Use environment variables prefixed with `NEXT_PUBLIC_` only for values safe to expose to the browser.

### Dependencies
- NEVER add a new external dependency without asking the user first.
- Prefer built-in Next.js features (Image, Link, Font, Metadata API) over third-party alternatives.

---

## Project Structure (Relevant Subset)

```text
apps/client/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, global providers)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles and Tailwind directives
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── dashboard/
│       ├── page.tsx            # Dashboard page
│       ├── layout.tsx          # Dashboard-specific layout (optional)
│       ├── loading.tsx         # Loading state (optional)
│       └── error.tsx           # Error boundary (optional)
├── components/                 # Reusable components (see nextjs-component skill)
├── lib/                        # API client & utilities (see nextjs-api-client skill)
├── types/                      # TypeScript types (see nextjs-api-client skill)
└── public/                     # Static assets
```

---

## Steps to Execute

1. **Clarify the requirement**
   - Identify the route path (e.g., `/dashboard`, `/rewards`).
   - Determine data requirements — does the page need backend API data?
   - Decide if the page is a Server Component (default) or needs `"use client"`.
   - Check if the required components already exist in `components/`.
   - Check if the required API client functions already exist in `lib/api.ts`.

2. **Create the page file**
   - Add `page.tsx` inside the appropriate `app/<route>/` directory.
   - Use Server Components for data fetching when possible.
   - Compose the page from components in `components/`.
   - Example:
     ```tsx
     import { Metadata } from "next";
     import RewardCard from "@/components/RewardCard";
     import { getRewards } from "@/lib/api";

     export const metadata: Metadata = {
       title: "Dashboard | App",
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

3. **Export metadata for SEO**
   - Every page MUST export a `metadata` object with at least `title` and `description`.
   - Use the `Metadata` type from `next` for type safety.

4. **Add layout if needed**
   - If the page needs shared UI (nav, sidebar, footer) specific to its route segment, create a `layout.tsx`.
   - Do NOT duplicate root layout concerns (fonts, global providers).
   - Example:
     ```tsx
     export default function DashboardLayout({
       children,
     }: {
       children: React.ReactNode;
     }) {
       return (
         <div className="flex min-h-screen">
           <aside className="w-64 border-r p-4">Sidebar</aside>
           <div className="flex-1 p-6">{children}</div>
         </div>
       );
     }
     ```

5. **Add loading/error states if needed**
   - `loading.tsx` — shown while the page's async data is loading.
   - `error.tsx` — shown when the page throws an error (must be a Client Component with `"use client"`).

6. **Validate**
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
- Page files in `app/<route>/page.tsx`.
- Layout files in `app/<route>/layout.tsx` (if needed).
- Loading/error files in `app/<route>/loading.tsx` and `error.tsx` (if needed).
- Brief explanation of Server vs Client Component decision.

---

## Suggested Next Skills
- `nextjs-component` — if the page needs a reusable component that doesn't exist yet.
- `nextjs-api-client` — if the page needs API data fetching functions or types that don't exist yet.
- `fastapi-api` — if the page needs a backend endpoint that doesn't exist yet.

---

## Checklist
- [ ] Page file exists at `app/<route>/page.tsx`
- [ ] Page exports `metadata` for SEO (title and description)
- [ ] Server Component is used by default; `"use client"` only if genuinely needed
- [ ] Page composes from reusable components in `components/`
- [ ] Data fetching uses API client from `lib/api.ts`
- [ ] Layout is added only if shared UI is needed for the route segment
- [ ] Naming conventions follow project rules (kebab-case route folders)
- [ ] Page renders correctly on the dev server with no console errors
