----
name: audit-code-quality
description: Audits the client codebase for structural issues, code duplication (DRY violations), and over-engineered logic (KISS violations).
----

# Skill: Auditing Code Quality

## When to Use
Use this skill when:
- Reviewing PRs or new features.
- Planning a refactor or cleanup session.
- The user reports "the code is getting messy" or "we have too much duplication".
- Identifying tech debt in the frontend architecture.

Do NOT use when:
- Doing exploratory research or debugging a single bug (unless the bug is caused by poor quality).
- Making trivial changes that don't affect code structure.

---

## Input
- Codebase directory (default: `apps/client`).
- Project rules and standards (e.g., `rules.md`, `.agents/rules/frontend.md`).
- Access to all source files (`.ts`, `.tsx`).

---

## Constraints and Guidelines
- Follow the **KISS** (Keep It Simple, Stupid) principle: Prefer simple, readable logic over complex, "clever" abstractions.
- Follow the **DRY** (Don't Repeat Yourself) principle: Identify repeated logic, components, or types that should be centralized.
- Enforce the **Single Responsibility Principle**: Flag components or functions that are doing too many things.
- Respect existing project patterns (e.g., where API calls are located, how state is managed).

---

## Steps to Execute

1. **Analyze Structure**
   - Verify that files are in the correct directories (e.g., components in `components/`, types in `types/`, routes in `app/`).
   - Check for circular dependencies or deeply nested folder structures.

2. **Identify DRY Violations**
   - Look for similar code blocks across different files (e.g., repeated form validation, similar API fetching patterns).
   - Check for duplicated TypeScript types or interfaces.
   - Identify UI patterns that are repeated instead of using a shared component.

3. **Identify KISS Violations**
   - Look for overly complex functions or components (e.g., large files > 300 lines, functions with high cyclomatic complexity).
   - Flag "premature abstractions" that make the code harder to follow than a simple implementation.

4. **Review API and State Patterns**
   - Ensure API calls are handled consistently (e.g., using a central client or specific hooks).
   - Verify that state management (Context, local state) is used appropriately and not over-complicated.

5. **Generate Quality Report**
   - Create an artifact (e.g., `audit_quality_results.md`) with specific examples of violations.
   - Provide "Before vs After" refactoring suggestions for key issues.
   - Categorize by impact (e.g., "Refactor Recommended", "Technical Debt", "Critical Cleanup").

---

## Output Format
- A structured quality audit report.
- Specific file/line references for every violation.
- Actionable refactoring plan.

---

## Checklist
- [ ] Structure follows project rules and `frontend.md`
- [ ] Significant code duplication is identified
- [ ] Over-engineered or "clever" code is flagged for simplification
- [ ] Refactoring suggestions are practical and maintainable
- [ ] File size and component complexity are reviewed
