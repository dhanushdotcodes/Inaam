----
name: create-new-skill
description: Create a new skill in the `.agents/skills/` directory for any task or workflow, prompting the user with targeted questions to clarify and refine the new skill's requirements before creating it.
----

# Skill: Creating a new skill

## When to Use
Use this skill when:
- Explicitly asked by the user to create a new skill for the agent to use.
- A new repetitive or complex workflow is identified that would benefit from having its own dedicated skill.
- Creating reusable steps, templates, or instructions for specialized tasks.

Do NOT use when:
- Simply writing code or doing a one-off task that falls under general development rules.
- The task fits entirely within an existing skill (adapt the existing skill instead).

---

## Input
- User's initial request or prompt outlining the new skill's purpose.
- Core technologies and patterns used in the workspace.
- Specific rules and guidelines from the project's rules or `.antigravity/` configuration.

---

## Steps to Execute

1. Analyze and clarify the requirements
   - Examine the user's initial request for the new skill.
   - Ask valid questions to refine the purpose and scope of the skill. Questions should cover:
     - What are the explicit trigger conditions (When to Use)?
     - What are the core inputs, tech stack, and configurations required?
     - What specific step-by-step actions must the agent execute?
     - What are the expected outputs and verification checklists?
   - Pause for the user's response and incorporate their answers into the skill design.

2. Design the skill structure
   - Follow the established layout: name, description, When to Use, Input, Steps to Execute, Output Format, and Checklist.
   - Ensure clear separation between triggering conditions, actionable instructions, and verification steps.

3. Write the skill instructions
   - Use Markdown for the `SKILL.md` file.
   - Include standard YAML frontmatter (`----` format) at the top containing the skill's name and description.
   - Outline explicit "When to Use" and "Do NOT use" sections to guide the agent.
   - Detail precise, step-by-step actionable instructions for "Steps to Execute".

4. Add supporting assets (Optional)
   - If the skill requires helper scripts or templates, include them in a `scripts/` or `resources/` folder under the skill's directory.

5. Final verification
   - Ensure the `SKILL.md` follows proper Markdown formatting.
   - Review against the project's core rules and conventions to ensure alignment.
   - Verify that all checklists and examples are practical and accurate.

---

## Output Format
- A new skill directory under `.agents/skills/<skill-name>/`.
- A fully populated `SKILL.md` file inside the new skill directory following the standard format.
- Optional helper scripts or template resources placed in the appropriate subdirectories.

---

## Checklist
- [ ] Requirements and scope have been clarified by asking the user targeted questions
- [ ] Skill directory exists under `.agents/skills/`
- [ ] `SKILL.md` contains the required YAML frontmatter
- [ ] Explicit Trigger and Anti-Trigger conditions are clearly defined
- [ ] Every step is actionable, clear, and easy to follow
- [ ] Output format and verification checklist are clearly articulated