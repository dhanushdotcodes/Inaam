# Workflow: Changelog Management

## Description
This workflow ensures that the project's `CHANGELOG.md` is consistently updated following significant commits or at the end of each work session, adhering to the "Keep a Changelog" format and project-specific rules.

## When to Use
- Immediately after significant commits.
- At the end of a work session or day.
- Before preparing a new release.

## Steps to Execute

### 1. Identify Changes
- Review the commit history since the last changelog update.
- Identify meaningful updates (features, bug fixes, breaking changes, etc.).

### 2. Categorize Changes
Group identified changes into the following categories:
- **Added**: For new features.
- **Changed**: For changes in existing functionality.
- **Deprecated**: For soon-to-be removed features.
- **Removed**: For now removed features.
- **Fixed**: For any bug fixes.
- **Security**: In case of vulnerabilities.

### 3. Update the File
- Open `CHANGELOG.md`.
- If a section for the current date (`## [Version] - YYYY-MM-DD`) does not exist, create one below the `[Unreleased]` section.
- Add the categorized bullet points under the appropriate category headings.
- Ensure the descriptions are concise and describe the "what" and "why" rather than the implementation details.

### 4. Verify Format
Ensure the file follows this structure:
```markdown
## [Unreleased]

## [Version] - YYYY-MM-DD
### Added
- Feature description.
```

### 5. Commit
- Stage the `CHANGELOG.md` file.
- Commit using the conventional commit format: `docs(chore): update CHANGELOG.md`.

## Constraints
- **NEVER** skip updating the changelog after a significant task.
- **ALWAYS** use ISO 8601 date format (`YYYY-MM-DD`).
- **KEEP** entries user-friendly and readable.
