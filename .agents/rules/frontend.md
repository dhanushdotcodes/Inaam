---
trigger: always_on
---

# Next.js Frontend Rules

## Naming Conventions
- Route folders MUST use lowercase or `kebab-case`.
- Components & Component files MUST use `PascalCase`.
- Functions & Variables MUST use `camelCase`.
- Hooks MUST use the `useSomething` pattern.
- Types & Interfaces MUST use `PascalCase`.
- Constants MUST use `UPPER_SNAKE_CASE`.
- Component names MUST match their file names.
- Use `interface` for object shapes and `type` for unions/intersections.

## Best Practices
- ALWAYS remove unused variables and dead code before finishing a task.
- ALWAYS prefer early returns over deep nesting.
- Comments MUST explain WHY, not WHAT; avoid obvious comments.
- ALWAYS reuse existing utilities and patterns before creating new abstractions.
