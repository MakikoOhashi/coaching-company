# Data Boundary

## Core Principle

This project should clearly separate:

- repository documentation
- application logic
- real operational data

The repository is not the place for private learner records.

## What Lives In The Database

All real learner data and changing operational state should live in the database.

This includes:

- student profile
- target exam and target date
- learning history
- answer history
- current progress
- current roadmap
- current milestone
- pass probability snapshots
- risk status
- CEO decision records
- coach session records
- accumulated operational experience tied to real outcomes

If the value changes during operation and belongs to a real learner, it should generally be stored in the database.

## What Lives In Code

Code should hold the logic that reads, transforms, and updates data.

This includes:

- probability calculation logic
- risk detection logic
- roadmap update logic
- prompt orchestration logic
- API handlers
- database mapping logic
- Airia integration logic

Code should define behavior, not store private learner state.

## What Lives In The Repository

The repository should hold public-safe design artifacts and implementation source.

This includes:

- architecture decisions
- agent role definitions
- prompt templates
- workflow design
- state templates
- experience templates
- sample or anonymized data only

The files in `state/` and `experience/` should be treated as structure templates or examples, not as storage for real learner records.

## Why Student Data Should Be In The Database

Student profile, progress, and coaching state should all live in the database because they are:

- private
- mutable
- operational
- needed across sessions
- unsuitable for public version control

This means student profile and progress are not just backend details. They are part of the real operating state of the company.

## Recommended Mental Model

- `docs/`
  company design
- `agents/` and `shared/`
  company rules
- database
  company memory and live operating state
- code
  company execution mechanism

## Practical Rule

If a value answers one of these questions, it likely belongs in the database:

- Who is this learner?
- What did this learner do?
- What is this learner's current status?
- What should happen next for this learner?
- What did the system decide for this learner?

If a value answers one of these questions, it likely belongs in code or docs instead:

- How should the system decide?
- What is the role of this agent?
- What workflow should happen on escalation?
- What fields make up a valid coaching state?
