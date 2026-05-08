# Skill Context and Structure

## Structure

```
├── .agents/skills/
│   ├── skill-name/
│   │   ├── SKILL.md         # What it does, inputs, outputs, steps
│   │   └── scripts/         # Optional automation scripts
│   └── another-skill/
│       └── SKILL.md
```

## SKILL.md Template

```markdown
# Skill Name

## Description
What this skill does in one sentence.

## When to Use
- Trigger condition 1
- Trigger condition 2

## Inputs
- `param1` — Description (required)
- `param2` — Description (optional, default: value)

## Steps
1. Step one
2. Step two
3. Step three

## Output
What gets produced (file, API call, message, etc.)

## Example
Example invocation or usage.
```

## How Skills Work with Rules

Rules define **how** to write code. Skills define **what** to do for specific tasks.

```
Rules (.agents/rules/*.mdc)
├── "Use clean architecture"          ← HOW
├── "Never hardcode secrets"          ← HOW
├── "Use Pydantic for validation"     ← HOW

Skills (.agents/skills/*)
├── "Deploy to AWS ECS"               ← WHAT
├── "Scrape leads from Google Maps"   ← WHAT
├── "Generate video thumbnails"       ← WHAT
```

## Auto-Discovery

Add this to your `.agents/CLAUDE.md` so Antigravity AI checks skills before building:

```markdown
## Skills
Before building anything, check `.agents/skills/` for existing patterns.
Adapt existing skills instead of starting from scratch.
```

## Skill Categories

| Category | Example Skills |
|----------|---------------|

## Creating a New Skill

1. Create folder: `.agents/skills/my-skill/`
2. Write `SKILL.md` using the template above
3. Add scripts in `scripts/`
