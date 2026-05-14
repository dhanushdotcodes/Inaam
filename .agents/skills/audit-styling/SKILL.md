----
name: audit-styling
description: Audits the client application for styling inconsistencies, hardcoded values, and deviations from the project's design system.
----

# Skill: Auditing Styling Consistency

## When to Use
Use this skill when:
- Reviewing a new feature's UI implementation.
- Performing a periodic audit of the design system alignment.
- The user reports "UI looks inconsistent" or "hardcoded colors found".
- Preparing for a CSS refactor or migration (e.g., to Tailwind v4).

Do NOT use when:
- Working on logic-only components or backend services.
- The project doesn't have a defined design system or `ui-guidelines.json`.

---

## Input
- Project design guidelines (e.g., `.context/ui-guidelines.json`).
- Path to scan (default: `apps/client`).
- Global CSS files (e.g., `apps/client/app/globals.css`).

---

## Constraints and Guidelines
- Focus on identifying hardcoded hex codes, pixel values, and inline styles that should use design tokens.
- Check for consistency in spacing, typography, and border radii.
- Cross-reference component styles with the `ui-guidelines.json` if available.
- Prioritize fixing global violations over one-off exceptions.

---

## Steps to Execute

1. **Load Design Tokens**
   - Read `.context/ui-guidelines.json` and any CSS variables defined in global stylesheets.
   - Identify allowed colors, spacing values, and typography scales.

2. **Scan for Hardcoded Values**
   - Use `grep` or similar tools to find hex codes (`#RRGGBB`), `rgb()`, and `px` values in `.tsx`, `.ts`, and `.css` files.
   - Filter out legitimate uses (e.g., in configuration or third-party lib wrappers).

3. **Check Design Alignment**
   - Compare component-specific styles with the design guidelines.
   - Identify where custom CSS is used instead of Tailwind utility classes (if Tailwind is the standard).

4. **Identify Component Inconsistencies**
   - Look for similar components (e.g., Buttons, Cards) that use different styling patterns.
   - Verify that primary/secondary/ghost button states match the guidelines.

5. **Generate Audit Report**
   - Create an artifact (e.g., `audit_styling_results.md`) listing all violations.
   - Categorize by severity (e.g., "Critical: Hardcoded Colors", "Warning: Non-standard Spacing").
   - Provide suggested fixes (e.g., "Replace #3b82f6 with var(--primary)").

---

## Output Format
- A detailed audit report artifact.
- A summary of violations grouped by file and type.
- A list of recommended "quick fixes".

---

## Checklist
- [ ] `ui-guidelines.json` has been consulted
- [ ] Hardcoded colors and pixels are identified
- [ ] Inline styles are flagged
- [ ] Audit report is clear and actionable
- [ ] Severity levels are appropriately assigned
