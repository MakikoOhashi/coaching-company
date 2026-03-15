# State Update Model

## Why This Matters

This product should not behave like a normal coaching chat that gives advice and then disappears.

Its core difference is that internal company state changes after decisions are made.

That means:

- the CEO makes a strategic judgment
- internal agents receive that judgment
- internal files are updated
- the next session starts from the updated state

This is what makes the system feel like an operating company rather than a one-off conversation tool.

## Core Principle

Not every file should be editable by every agent.

The system should separate:

- files that describe stable company rules
- files that describe changing operating state

Only the changing operating state should be updated automatically in the first version.

## File Categories

### Stable Files

These should rarely change and should not be rewritten automatically during normal operation.

- `agents/*/prompt.md`
- `agents/*/role.md`
- `agents/*/handoff.md`
- `shared/company-policy.md`
- `shared/escalation-rules.md`
- `shared/output-contracts.md`

These define the company itself.

### Mutable Operating Files

These represent the current working state of the company and can be updated by the system.

Examples of mutable state files to introduce later:

- `state/student-profile.md`
- `state/current-roadmap.md`
- `state/today-plan.md`
- `state/current-milestone.md`
- `state/pass-probability.md`
- `state/risk-status.md`
- `state/session-log.md`
- `state/ceo-decisions.md`

These define the current operating condition for one learner.

### Experience Files

These capture what the organization has learned over time.

They are not the same as current state.

Current state answers:

- what is happening now
- what the learner should do next
- what the current risk is

Experience answers:

- what has worked before
- what patterns tend to predict trouble
- what style of intervention improves follow-through

Examples of experience files to introduce later:

- `experience/coach-playbook.md`
- `experience/ceo-decisions-log.md`
- `experience/effective-interventions.md`
- `experience/risk-patterns.md`

These should act like internal company knowledge, not unstable identity rewrites.

## Who Can Update What

### CEO

The CEO can update:

- strategic priorities
- risk classification
- milestone direction
- escalation decisions

Example files:

- `state/ceo-decisions.md`
- `state/current-roadmap.md`
- `state/current-milestone.md`
- `state/risk-status.md`

The CEO should not directly rewrite stable identity files such as prompts and role definitions in the MVP.

The CEO can also append to organizational experience files when a strategic pattern is discovered.

### Coach

The Coach can update:

- today's study plan
- current session goal
- session summary
- immediate execution notes

Example files:

- `state/today-plan.md`
- `state/session-log.md`
- `state/current-milestone.md`

The Coach should not change company-wide policy or escalation rules.

The Coach can append to experience records when a concrete intervention repeatedly works.

### Data

The Data role can update:

- pass probability
- readiness estimate
- recent progress summary
- risk indicators based on logs

Example files:

- `state/pass-probability.md`
- `state/risk-status.md`
- `state/session-log.md`

The Data role should not decide strategy alone. It should provide signals that feed the CEO.

The Data role can add trend findings to experience files when patterns are supported by logs.

### Marketing

The Marketing role can update:

- message hypotheses
- landing page positioning notes
- market-facing recommendations

Example files:

- `state/marketing-notes.md`
- `state/positioning-notes.md`

Marketing should not access private learner data unless explicitly allowed.

## Example Flow

1. Student reports weak performance in civil law.
2. Coach logs the result in `state/session-log.md`.
3. Data updates `state/pass-probability.md` and `state/risk-status.md`.
4. CEO reviews the risk and updates `state/current-roadmap.md`.
5. Coach uses the updated roadmap to generate the next session goal.

This means the conversation creates persistent organizational change.

If the same intervention repeatedly works, that pattern can also be written into an experience file for future reuse.

## Difference From a Normal Coaching Service

A normal coaching service often stops at:

- advice
- encouragement
- temporary conversation context

This system should go further:

- decisions become written operating state
- operating state changes future decisions
- the internal organization keeps continuity over time
- useful interventions accumulate as internal know-how

That continuity is one of the core product differentiators.

## MVP Recommendation

For the first version:

- keep prompts and company rules fixed
- allow updates only to operating state files
- keep write permissions narrow by role
- log CEO decisions explicitly
- store experience as reference knowledge, not as automatic identity rewriting

This gives the product adaptive behavior without making the organization unstable.
