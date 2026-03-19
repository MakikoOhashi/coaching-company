# Coaching Company Ops

An AI-run coaching company where every employee is AI.

すべての社員がAIで構成されたコーチングカンパニー。

A fully AI-operated coaching company that starts working the moment a learner arrives and takes over planning, study management, practice design, progress tracking, and next actions so the learner can focus only on doing the work.

学習者が来た瞬間からAIの会社が運営を開始し、プランニング、学習管理、問題設計、進捗把握、次の行動指示までを引き受けることで、学習者は与えられたことを実行することに集中できるサービス。

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

## MVP Core Behaviors

The first demo must be able to:

- tell the learner what to do today
- accept and interpret a learner progress report
- show current pass probability
- escalate to the AI CEO when necessary

These actions should be triggered through natural learner messages, not only fixed buttons.

## System Shape

The current implementation direction is:

- `Frontend`
  guided student experience
- `common-ai-api`
  core backend logic
- `Airia`
  workflow orchestration for CEO, coach, escalation, and review flows

The repository stores the design and implementation source of this system, but is not itself deployed directly to Airia as a whole.

## Runtime Integration

The runtime connection between the product and Airia is intentionally split across three layers:

1. `Frontend`
   the learner-facing coaching product deployed separately
2. `common-ai-api`
   the main backend that receives product requests, builds review payloads, and handles private logic
3. `Airia`
   the company-side operations layer that returns structured review decisions

In practice, the flow is:

- learner uses the frontend coaching product
- frontend calls `common-ai-api`
- `common-ai-api` handles routine product logic and, when company review is needed, sends a review case to the Airia agent
- Airia returns a structured company decision such as `keep_current_plan`, `reduce_load`, `increase_load`, `switch_subject`, or `human_review`
- `common-ai-api` returns that result back to the product and company-side view

This means the repository explains and implements the product layer, while Airia runs the company-side decision workflow that the backend calls at runtime.

## Airia Agent

Company-side operations agent on Airia:

- [Coaching Company Ops](https://community.airia.ai/import-agent/CUmyXGjL4IrFhDEcjQznpq2epY8nbHSU3qyYLepa2SY)

Community approval is currently pending.

## Demo Video

- [YouTube Demo](https://youtu.be/ryLPaiVdb6Y)

## Current Company Roles

The current demo already behaves like a small operating company, not just a single tutor.

- `Learner-facing Coach`
  runs the study session, asks the learner to explain mistakes, and keeps the session moving
- `Daily Review`
  checks whether today's plan still makes sense based on current learner state and recent performance
- `CEO Escalation Review`
  handles cases where the coach should no longer decide the next step alone
- `Monthly Strategy Review`
  checks whether the learner's overall direction, pacing, and subject balance are still sound
- `Company Review Screen`
  shows the company-side decision layer behind the product

Together, these roles make the company visible as an operating layer behind the learner experience.

## Future Company Roles

The hackathon version focuses on the CEO and review layer first.

The broader company design still includes additional internal roles that can be added later:

- `Marketing`
  learner engagement, retention strategy, and communication experiments
- `Back Office`
  scheduling, reporting, and human escalation operations
- `Data / Improvement`
  coach-quality review, intervention analysis, and prompt or workflow iteration

These roles are not the current implementation priority, but they are part of the intended company expansion.

## Key Docs

- [Vision](docs/vision.md)
- [Product Direction](docs/product-direction.md)
- [Architecture](docs/architecture.md)
- [Airia Company Plan](docs/airia-company-plan.md)
- [CEO Escalation Contract](docs/ceo-escalation-contract.md)
- [Daily Quota Design](docs/daily-quota-design.md)

Additional working documents, internal design notes, and supporting specs are available in [`docs/`](docs/).

## Current Structure

- `agents/`
  persona-specific definitions
- `shared/`
  company-wide policies and contracts
- `state/`
  mutable operating state
- `experience/`
  accumulated organizational learning
- `docs/`
  project decisions and design documents

## Initial Operating Files

Current mutable state templates:

- `state/student-profile.md`
- `state/current-roadmap.md`
- `state/today-plan.md`
- `state/current-milestone.md`
- `state/pass-probability.md`
- `state/risk-status.md`
- `state/session-log.md`
- `state/ceo-decisions.md`

Current experience templates:

- `experience/coach-playbook.md`
- `experience/ceo-decisions-log.md`
- `experience/effective-interventions.md`
- `experience/risk-patterns.md`
