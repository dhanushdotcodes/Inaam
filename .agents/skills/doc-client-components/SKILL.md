----
name: doc-client-components
description: Maps and documents component relationships, hierarchies, and data flow within the Next.js client application.
----

# Skill: Documenting Client Components

## When to Use
Use this skill when:
- Adding new complex components to `apps/client`.
- Refactoring the component hierarchy.
- Onboarding or performing a technical audit of the frontend structure.
- The user asks to "map components" or "show how components are connected".

Do NOT use when:
- Working on backend code.
- Making simple UI tweaks that don't change component relationships.

---

## Input
- Path to the component directory (default: `apps/client/components`).
- Target documentation file (default: `docs/CLIENT_COMPONENTS.md`).
- Access to `package.json` for dependency analysis.

---

## Constraints and Guidelines
- Use Mermaid `graph TD` diagrams for visual representation.
- Focus on "smart" components (containers/pages) and their relationship with "dumb" components (UI).
- Document prop interfaces for key components.
- Highlight shared state (Context/Redux) usage if applicable.

---

## Steps to Execute

1. **Scan Component Directory**
   - List all components in `apps/client/components` and `apps/client/app`.
   - Identify the main entry points (pages and layouts).

2. **Analyze Imports and Props**
   - For each major component, identify what other components it imports.
   - Trace the data flow (props passing).
   - Check for usage of `useContext` to identify state dependencies.

3. **Generate Component Map**
   - Create a Mermaid diagram showing the parent-child relationships.
   - Group components by feature or directory.

4. **Document Prop Interfaces**
   - List the primary props and their types for the most important components.
   - Mention if a component is a "Client Component" (`"use client"`) or a "Server Component".

5. **Update Documentation**
   - Write or update `docs/CLIENT_COMPONENTS.md` with the findings.
   - Ensure the diagram is rendered correctly in markdown.

---

## Output Format
- An updated or new `docs/CLIENT_COMPONENTS.md` file.
- Mermaid diagrams visualizing the hierarchy.
- A table listing key components, their purpose, and their dependencies.

---

## Checklist
- [ ] Hierarchy accurately reflects the current codebase
- [ ] Mermaid syntax is valid and readable
- [ ] Server vs Client component distinction is clear
- [ ] Prop interfaces for major components are documented
- [ ] Documentation is stored in the correct path
