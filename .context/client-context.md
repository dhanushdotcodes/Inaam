# Client Context: Inaam Web Application

This document provides a high-level overview of the Inaam client-side application, its feature domains, user flows, and architectural decisions.

## Application Purpose

Inaam is a Progressive Web Application (PWA) designed to help users track and claim rewards by completing associated tasks. It uses a gamified approach with "Prizes" (point-based rewards) and "Bounties" (independent tasks).

---

## Feature Domains

### 1. Dashboard & Navigation
- **Location**: `apps/client/app/(dashboard)`
- **Purpose**: Provides the primary layout, sidebar navigation, and global state management (like sidebar collapse).
- **Key Components**: `Sidebar`, `Navbar`.

### 2. Task Management (Bounties)
- **Location**: `apps/client/app/(dashboard)/tasks` and `apps/client/components/tasks`
- **Purpose**: Allows users to view and complete independent "Bounties" to earn points.
- **Concepts**:
  - **Bounties**: Standalone tasks that grant points upon completion.

### 3. Reward Management (Prizes)
- **Location**: `apps/client/app/(dashboard)/prizes` and `apps/client/components/rewards`
- **Purpose**: The core "value" of the app. Users work towards saving up for Prizes.
- **Concepts**:
  - **Prizes**: Rewards that are purchased using points earned from Bounties. Managed in the **Prizes** shop.


---

## Primary User Flows

### Flow 1: Daily Engagement (Earning Points)
1. User logs in (Auth flow).
2. User navigates to the **Tasks** dashboard.
3. User identifies a **Bounty** they can complete.
4. User completes the task and marks it as finished.
5. Points are added to the user's balance.

### Flow 2: Reward Redemption
1. User navigates to **Prizes** to spend points.
2. The reward is marked as "Claimed".

---

## Technical Logic

### Data Fetching & API
- **Tool**: `lib/api.ts` (`apiFetch`).
- **Pattern**: Centralized wrapper around the native `fetch` API.
- **Auth**: JWT-based authentication. The token is sent in the `Authorization` header.
- **Error Handling**: Standardized error responses from the FastAPI backend are handled globally.

### State Management
- **Local State**: Used extensively for UI-only toggles (dialogs, hover states).
- **Context API**: Used for cross-cutting concerns like `SidebarContext`.
- **Server Components**: Leveraged for initial data fetching to reduce client-side bundle size.

### Styling & Design System
- **Framework**: Tailwind CSS v4.
- **Theme**: Dark-mode primary with vibrant accents (e.g., EOS primary colors).
- **Guidelines**: Strictly follows `.context/ui-guidelines.json` for colors, spacing, and typography.

### Sorting Logic
To maintain focus on active goals, the application implements specific sorting rules:
- **Grouping**: Uncompleted tasks and unclaimed rewards are always prioritized at the top of lists.
- **Tasks**:
  - **Active**: Sorted by `created_at` (latest first).
  - **Completed**: Pushed to the bottom, sorted by `completed_at` (most recently completed first).
- **Rewards**:
  - **Available**: Sorted by `created_at` (latest first).
  - **Claimed**: Pushed to the bottom, sorted by `claimed_at` (most recently claimed first).

---

## Mental Model for Developers

When working on the Inaam client, think in terms of **Tasks** (effort) and **Rewards** (value).
- The effort is a **Bounty** (standalone task).
- The value is a **Prize** (points-based reward).

The UI should always feel "premium" and "clinical," with smooth transitions and clear progress indicators.
