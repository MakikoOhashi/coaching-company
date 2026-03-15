# MVP

## Goal

Build a demoable coaching company prototype in a few days.

The MVP should prove that the system can:

- tell the student what to do today
- accept a study report
- update progress
- estimate pass likelihood
- escalate important cases upward

## What To Keep

- one model
- one main student-facing coach
- one CEO layer
- simple progress tracking
- minimal UI

## What To Cut

- complex personality modeling
- deep multi-agent separation at runtime
- broad exam coverage
- full production infrastructure
- unnecessary chat-heavy interactions

## Suggested Product Shape

The interface should focus on:

- today's tasks
- report progress
- current pass chance
- ask coach when needed

The first implementation should prioritize the following order:

1. The roadmap keeps moving.
2. The system tells the student what to do today.
3. The system updates the plan when the student reports progress.
4. Voice or avatar can be added only if there is time.

## Delivery Strategy

To move fast:

- keep logic simple
- document decisions clearly
- use Airia only where it adds visible workflow value
- avoid spending time on infrastructure that does not improve the demo
- keep `common-ai-api` as the main backend instead of creating extra backend layers

## UX Direction

The first UX should not feel like a dashboard full of choices.

The user should not be asked to constantly decide between many options. Instead, the experience should feel closer to a one-on-one teacher session:

- the coach initiates the study flow
- the coach proposes the next target
- the coach asks for available time
- the coach sets the session goal
- the student mainly responds, rather than planning

This means the product should feel more like guided instruction than open-ended chat.

The student should mostly execute, not strategize.

The system should own:

- roadmap planning
- strategy updates
- coaching structure
- milestone tracking

## Engineering Constraint

The project should avoid introducing unnecessary architecture for the sake of purity.

For this MVP:

- the frontend should not own pass calculation or private business logic
- `common-ai-api` should remain the central backend
- Airia should be added as the workflow layer above it

This keeps the implementation simple enough to ship quickly.
