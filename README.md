# Coaching Company

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

## Documentation

- [Vision](docs/vision.md)
- [Product Direction](docs/product-direction.md)
- [Architecture](docs/architecture.md)
- [Data Boundary](docs/data-boundary.md)
- [Product Positioning](docs/product-positioning.md)
- [Company Onboarding](docs/company-onboarding.md)
- [Question Strategy](docs/question-strategy.md)
- [Question Bank Strategy](docs/question-bank-strategy.md)
- [Intervention Strategy](docs/intervention-strategy.md)
- [Coaching Schema SQL](docs/coaching-schema.sql)
- [Coaching Schema Notes](docs/coaching-schema-notes.md)
- [Minimal DB Design](docs/minimal-db-design.md)
- [Kanrigyomu Mapping](docs/kanrigyomu-mapping.md)
- [State Update Model](docs/state-update-model.md)
- [Workflow](docs/workflow.md)
- [MVP](docs/mvp.md)
- [Open Questions](docs/open-questions.md)

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
