----
name: audit-client-arch
description: Analyzes the client application's architecture, identifying component hierarchies, missing abstractions, logic extraction opportunities (hooks), and state management improvements.
----

# Skill: Client Architecture Audit

## When to Use
Use this skill when:
- Performing a deep technical audit of the `apps/client` codebase.
- Identifying opportunities for refactoring and improving code reuse.
- Analyzing the relationship between components on a per-page basis.
- The user asks to "analyze architecture", "find missing components", or "check hooks/state management".

Do NOT use when:
- Making simple styling changes (use `audit-styling` instead).
- Checking for basic DRY/KISS violations (use `audit-code-quality` instead).
- Working exclusively on the backend.

---

## Input
- Path to the client application (default: `apps/client`).
- Target audit file (default: `.context/audit-architecture-results.md`).
- Access to `app/` and `components/` directories.

---

## Constraints and Guidelines
- **Hierarchy**: Use Mermaid `graph TD` to visualize the relationship between the root layout, pages, and their child components.
- **Missing Components**: Identify patterns of JSX or UI logic that are repeated across multiple files but haven't been abstracted into shared components.
- **Hooks identification**: Look for complex `useEffect` or `useState` logic that handles side effects (API calls, event listeners) and can be extracted into custom hooks.
- **State Management**: Evaluate if local state is being "lifted" too high or if global state/events should be used for cross-component synchronization.
- **Error Handling**: Identify duplicated `try/catch` logic or inconsistent loading/error UI states that can be unified.

---

## Steps to Execute

1. **Scan Project Structure**
   - Identify the root layout (`app/layout.tsx`) and all page entry points in `app/`.
   - List associated components in `components/`.

2. **Analyze Root Architecture**
   - Map the global layout hierarchy (Layout -> Sidebar -> Content).
   - Identify global providers and state management (e.g., `SidebarContext`).
   - Check for global error boundaries or common error patterns.

3. **Per-Page Analysis**
   - For each page (Tasks, Quests, Prizes):
     - Generate a component hierarchy diagram.
     - Identify logic (API calls, filtering) that can be extracted into hooks.
     - Identify repeated UI patterns (cards, headers, buttons) that lack abstractions.
     - Evaluate the state management within that page's scope.

4. **Aggregate Findings**
   - Calculate total component counts (categorized by UI, Shared, Feature).
   - List "Potential Components" (new abstractions).
   - List "Suggested Hooks" (extracted logic).
   - Identify "Separable Error Handling" patterns.

5. **Generate Audit Report**
   - Create/Update `.context/audit-architecture-results.md`.
   - Include clear recommendations for each identified area.

---

## Output Format
- A detailed markdown report in `.context/audit-architecture-results.md`.
- Mermaid diagrams for each page's hierarchy.
- A "Roadmap for Refactoring" section with actionable tasks.

---

## Checklist
- [ ] Hierarchy accurately reflects the component connections
- [ ] Repeated patterns are identified as potential components
- [ ] Logic extraction opportunities (hooks) are clearly listed
- [ ] State management suggestions align with project patterns (Context vs Events)
- [ ] Error handling abstractions are proposed
- [ ] Audit report follows the standard project format
