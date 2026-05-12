# Dashboard Context

This document provides an overview of the Inaam dashboard architecture, routing, and core components.

## Overview

The dashboard is the central hub for users to manage their rewards, track their financials, and embark on quests. It is built with a responsive design that prioritizes a "premium" aesthetic and smooth interactions.

## Routing Structure

The dashboard uses Next.js App Router and is grouped under the `(dashboard)` folder for shared layout and protection.

| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/vault` | Vault | Main items dashboard (formerly Rewards). Shows rewards and tasks. |
| `/rewards` | Rewards | Financials and stats dashboard (formerly Treasury). |
| `/quests` | Quests | Consolidated list of all tasks across all rewards. |

## Core Architecture

### Authentication Protection
Authentication is centralized in `apps/client/app/(dashboard)/layout.tsx`. Any route within the `(dashboard)` group is automatically protected. Users are redirected to the root (`/`) if they are not authenticated.

### Sidebar Management
- **Context**: `SidebarContext` manages the `isOpen` state globally.
- **Behavior**:
    - **Desktop**: A persistent side rail that can be collapsed to an icon-only view.
    - **Mobile**: A different navigation style, typically a bottom navigation bar for quick access, with an optional drawer for secondary actions.

## Key Components

### 1. `DashboardLayout`
Wraps all dashboard pages. It provides:
- Authentication gate.
- Sidebar integration.
- Responsive main content area with standardized `<main className="flex-1 px-8 lg:px-12 py-4">` spacing.

### 2. `Sidebar`
A responsive navigation component.
- **Animations**: Uses `motion/react` for smooth sliding and width transitions.
- **Active States**: Highlighting based on the current `pathname` with a premium vertical indicator.
- **Mobile Support**: Includes a bottom navigation bar with a dedicated logout action.

### 3. `DashboardHeader`
A reusable header component used across all dashboard pages.
- Contains the page title and optional description.
- Includes the sidebar toggle button with rotation animations.

### 4. `Quests` Dashboard
Modular architecture for consolidated task tracking:
- **`QuestDashboard`**: Orchestrator for global task fetching and filtering.
- **`QuestList` & `QuestItem`**: High-performance animated list components with optimistic updates.
- **Title Mapping**: Automatically maps `reward_id` to human-readable reward titles.

### 5. `Rewards` (Financials)
- **`RewardsOverview`**: Standardized component for financial stats and transaction history.

## Design System & UI Guidelines

The dashboard follows a strict set of UI guidelines defined in `.context/ui-guidelines.json`:
- **Standard Heights**: All inputs and primary buttons are `h-10`.
- **Border Radii**: `rounded-xl` for UI elements (inputs, buttons, items) and `rounded-2xl/3xl` for major containers and cards.
- **Typography**: Uses `font-semibold` for interactive labels and navigation to ensure clarity.
- **Glassmorphism**: Utilizes backdrop blurs (`backdrop-blur-sm`) and semi-transparent backgrounds for a premium feel.

## Development Rules

- Always use `DashboardHeader` for page titles to maintain sidebar toggle consistency.
- Navigation items should be added to the `NAV_ITEMS` constant in `Sidebar.tsx`.
- New components should be broken down into modular sub-components within their feature folders.
- Follow the spacing scale in the UI guidelines: use the standardized `<main>` wrapper for page content.
- Rows and list items should be fully clickable for primary actions (e.g., toggling tasks).
