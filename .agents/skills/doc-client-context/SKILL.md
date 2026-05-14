----
name: doc-client-context
description: Documents the high-level context, business logic, and user flows of the client application.
----

# Skill: Documenting Client Context

## When to Use
Use this skill when:
- Creating a high-level overview of the frontend application.
- Documenting new features or complex user flows.
- Onboarding new developers to the client codebase.
- The user asks "what does this app do?" or "explain the client-side logic".

Do NOT use when:
- Documenting specific low-level component details (use `doc-client-components` instead).
- Working on backend-only logic.

---

## Input
- Client codebase directory (`apps/client`).
- Product requirements (e.g., `docs/PRD.md`).
- Existing context documents (e.g., `.context/dashboard-context.md`).

---

## Constraints and Guidelines
- Focus on the "Why" and "What" rather than just the "How".
- Summarize the main feature areas (e.g., Rewards, Tasks, Profile).
- Document the primary user personas and their flows.
- Explain the high-level state management strategy.
- Maintain a separate `docs/CLIENT_CONTEXT.md` file.

---

## Steps to Execute

1. **Review High-Level Goals**
   - Read `docs/PRD.md` and `docs/ARCHITECTURE.md` to understand the application's purpose.
   - Cross-reference with the directory structure in `apps/client/app`.

2. **Identify Main Feature Areas**
   - Group routes and components into logical feature domains (e.g., "Quest Management", "Reward Redemption", "User Authentication").
   - Summarize the purpose of each domain.

3. **Map User Flows**
   - Describe the main paths a user takes through the app (e.g., "Login -> Browse Rewards -> Complete Task -> Claim Reward").
   - Identify key interaction points.

4. **Summarize Client-Side Logic**
   - Explain how data is fetched and cached (e.g., React Query, SWR, or simple `useEffect`).
   - Describe the global state (e.g., Auth state, Theme state) and its impact on the UI.

5. **Update Context Documentation**
   - Write or update `docs/CLIENT_CONTEXT.md`.
   - Use clear, non-technical language where appropriate to explain business value.
   - Include a table of contents and links to more technical docs (like component maps).

---

## Output Format
- A comprehensive `docs/CLIENT_CONTEXT.md` file.
- A summary of the application's "Mental Model".
- A list of feature domains and their corresponding file paths.

---

## Checklist
- [ ] Business logic and user value are clearly explained
- [ ] Feature domains are accurately identified
- [ ] User flows are documented logically
- [ ] High-level state management is summarized
- [ ] Documentation is stored in `docs/CLIENT_CONTEXT.md`
