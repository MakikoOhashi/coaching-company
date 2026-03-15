# Architecture

## Organizational Model

The company is modeled as an AI organization.

- `Coach`
  handles day-to-day student interaction
- `CEO`
  handles strategy, exceptions, and human escalation
- `Data`
  aggregates progress and readiness signals
- `Marketing`
  analyzes positioning and entry experience

## Human Boundary

Human interaction should happen only through the CEO layer whenever possible.

This keeps the organization structure clear:

- Student talks to Coach
- Coach escalates upward when needed
- CEO decides whether to involve a human

## Runtime Model

The implementation can begin with one model and one runtime, while separating roles logically through prompts, policies, and contracts.

This means:

- one underlying model
- multiple internal personas
- separate files for each persona's prompt and responsibilities

## Airia Positioning

Airia should not necessarily run every frequent operation.

A practical architecture is:

- `common-ai-api` handles the core backend logic
- Airia handles workflow orchestration and company-level decision flow
- the frontend provides the guided coaching experience to the student

This preserves Airia's workflow value without exhausting execution limits on routine traffic.

## Final Working Split

The current intended system split is:

- `Frontend`
  the student-facing experience
- `common-ai-api`
  the primary backend for intelligence and private logic
- `Airia`
  the workflow and orchestration layer

### Frontend Responsibilities

- show the guided coaching session
- show the current milestone
- show current pass probability
- collect study reports
- present the coach as a teacher-like interface

### common-ai-api Responsibilities

- inference
- pass probability calculation
- study log processing
- per-student logic
- private backend behavior

This is the main backend and should remain the core execution layer for the product.

### Airia Responsibilities

- CEO workflow
- Coach workflow
- escalation judgment
- scheduled reviews
- human-in-the-loop
- multi-system coordination

Airia should be used as the operating workflow layer, not as the sole backend for all business logic.

## Deployment Model

The repository itself is not deployed directly to Airia.

Instead:

- this repository stores design, prompts, and implementation code
- the frontend is deployed separately
- `common-ai-api` remains a separately deployed backend
- Airia hosts the relevant agents and workflows

## Integration Principle

To avoid unnecessary complexity during the hackathon:

- do not create an extra backend only for this project unless needed
- do not move core logic into the frontend
- do use `common-ai-api` as the main backend
- do use Airia where visible workflow orchestration adds value

## Repository Structure

- `agents/<persona>/`
  prompt, role, and handoff definitions
- `shared/`
  company-wide rules and data contracts
- `docs/`
  project-level design decisions
