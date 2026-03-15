# Coaching Company

AI-run certification coaching company that automatically manages daily study plans, progress tracking, and escalation through an AI CEO structure.

## What This Project Is

This repository is the internal design and implementation space for an AI-operated coaching company.

The goal is not to build a simple chat tutor. The goal is to build a system where AI acts like an operating company:

- a coach handles routine student interaction
- a CEO reviews strategy and exceptions
- data functions track progress and risk
- humans intervene only at the CEO level when necessary

## Core Idea

Students should not need to carry the planning burden alone.

The system should reduce thinking overhead by deciding:

- what to do today
- how to recover after missed study days
- how likely the student is to pass
- when the study strategy should change

## System Shape

The current implementation direction is:

- `Frontend`
  guided student experience
- `common-ai-api`
  core backend logic
- `Airia`
  workflow orchestration for CEO, coach, escalation, and review flows

The repository stores the design and implementation source of this system, but is not itself deployed directly to Airia as a whole.

## Documentation

- [Vision](docs/vision.md)
- [Product Direction](docs/product-direction.md)
- [Architecture](docs/architecture.md)
- [Workflow](docs/workflow.md)
- [MVP](docs/mvp.md)
- [Open Questions](docs/open-questions.md)

## Current Structure

- `agents/`
  persona-specific definitions
- `shared/`
  company-wide policies and contracts
- `docs/`
  project decisions and design documents
