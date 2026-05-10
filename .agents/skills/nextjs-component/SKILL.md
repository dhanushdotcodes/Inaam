----
name: nextjs-component
description: Build reusable React components with typed props and Tailwind CSS v4 styling, following Server/Client Component best practices within the project's frontend architecture.
----

# Skill: Building Reusable Next.js Components

## When to Use
Use this skill when:
- Creating a new reusable React component (e.g., cards, buttons, modals, list items).
- Defining typed component props with TypeScript `interface`.
- Applying Tailwind CSS v4 styling to a component.
- Deciding whether a component should be a Server Component or Client Component.
- Adding hover, focus, and active interaction states to UI elements.

Do NOT use when:
- Creating a new page or route (use `nextjs-page` instead).
- Adding API client fetch functions or TypeScript types for API responses (use `nextjs-api-client` instead).
- Building or modifying backend API endpoints (use `fastapi-api` instead).
- Working with database models or migrations (use `handle-db` instead).
- Doing Docker or infrastructure work (use `containerise-app` instead).

---

## Input
- Stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, Bun.
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`.
- Path alias: `@/*` maps to the project root (`apps/client/*`).
- CSS variables defined in `globals.css` for design tokens (colors, spacing, fonts).

---

## Constraints and Guidelines

### Naming Conventions
- Component files MUST use `PascalCase` and match the exported component name (e.g., `RewardCard.tsx` exports `RewardCard`).
- Functions and variables inside components MUST use `camelCase`.
- Hooks MUST follow the `useSomething` pattern.
- Types and Interfaces MUST use `PascalCase`.
- Constants MUST use `UPPER_SNAKE_CASE`.
- Use `interface` for component prop shapes.

### Architecture Rules
- Reusable components live in `components/` at the project root level.
- **Modular Organization**: Large features SHOULD have their own directory within `components/` (e.g., `components/rewards/`).
- **Subdirectories**: Within feature directories, group components by their role:
  - `dialogs/`: For modal/popup components.
  - `tasks/` (or feature-specific sub-folders): For related sub-components.
  - `shared/`: For components used across multiple features.
- ALL components MUST have typed props using `interface`.
- Server Components are the default — use `"use client"` only when the component needs interactivity, hooks, or browser APIs.
- NEVER fetch data in Client Components when a Server Component can do it.

### Styling Rules
- Use Tailwind CSS v4 utility classes for all styling.
- Avoid inline `style` attributes unless dynamically computed.
- Use CSS variables defined in `globals.css` for design tokens.
- Ensure all interactive elements have proper hover/focus/active states.

### Security
- NEVER expose backend secrets or server-side tokens in client-side code.

### Dependencies
- NEVER add a new external dependency without asking the user first.
- Prefer built-in Next.js features (Image, Link) over third-party alternatives.

---

## Project Structure (Relevant Subset)

```text
apps/client/
├── components/
│   ├── rewards/                # Feature-specific directory
│   │   ├── dialogs/            # Grouped dialog components
│   │   │   ├── RewardFormDialog.tsx
│   │   │   └── TaskDetailsDialog.tsx
│   │   ├── tasks/              # Grouped task-related components
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   └── TaskList.tsx
│   │   ├── RewardCard.tsx
│   │   └── RewardsDashboard.tsx
│   └── shared/                 # Generic shared components
│       └── ProgressBar.tsx
├── app/
│   └── globals.css             # CSS variables and design tokens
└── types/
    └── index.ts                # Shared TypeScript types (see nextjs-api-client skill)
```

---

## Steps to Execute

1. **Clarify the component requirement**
   - Identify the component's purpose and where it will be used.
   - Determine if the component needs interactivity (Client Component) or can remain a Server Component.
   - Check if a similar component already exists in `components/` to extend or reuse.

2. **Define the props interface**
   - Create a `PascalCase` interface for the component's props.
   - Use descriptive property names with proper TypeScript types.
   - Import shared types from `types/` if they already exist (see `nextjs-api-client` skill).
   - Example:
     ```typescript
     interface RewardCardProps {
       reward: Reward;
       onRedeem: (id: string) => void;
     }
     ```

3. **Create the component file**
   - Place the file in `components/` with a `PascalCase` filename matching the component name.
   - Add `"use client"` directive at the top ONLY if the component genuinely needs interactivity (event handlers, hooks, browser APIs).
   - Export the component as the default export.
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

4. **Apply Tailwind styling**
   - Use Tailwind CSS v4 utility classes for all visual styling.
   - Reference CSS variables from `globals.css` for consistent design tokens.
   - Add hover, focus, and active states to all interactive elements.
   - Ensure responsive behavior using Tailwind breakpoint prefixes (`sm:`, `md:`, `lg:`).

5. **Validate**
   - Import and render the component in a page to verify it works.
   - Check for TypeScript errors in the terminal.
   - Verify no console errors in the browser.
   - Confirm hover/focus/active states work as expected.

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
- Component file in `components/<ComponentName>.tsx`.
- Props interface defined at the top of the component file or imported from `types/`.
- Brief explanation of Server vs Client Component decision.

---

## Suggested Next Skills
- `nextjs-page` — to wire the new component into a page.
- `nextjs-api-client` — if the component needs API data types that don't exist yet.
- `fastapi-api` — if the component needs a backend endpoint that doesn't exist yet.

---

## Checklist
- [ ] Component file uses `PascalCase` and matches the exported component name
- [ ] Props are typed with an `interface`
- [ ] `"use client"` is only added when the component genuinely needs it
- [ ] Tailwind CSS classes are used for all styling (no inline styles)
- [ ] Interactive elements have hover/focus/active states
- [ ] Component renders correctly with no TypeScript or console errors
- [ ] No hardcoded values — config or design tokens are used
