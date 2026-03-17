# Coach Growth Data Design

## Purpose

The coaching company should not only deliver questions. It should also accumulate the raw material needed for the AI coach to improve over time.

The main purpose of coach-growth logging is:

- to identify where learners get stuck
- to see which intervention styles help them move forward
- to understand which terms trigger follow-up questions
- to improve how daily quota and session opening decisions are made

## Minimal Principle

For the hackathon stage, growth data should be minimal and easy to collect.

We do not need a complex analytics system yet.

We only need a place to store:

- what the learner said
- what the coach replied
- what kind of intervention this was
- whether the learner continued or moved on

## Minimal Table

Use one minimal table:

- `coaching.coach_interactions`

This table is the first receiver for coach-growth data.

## What To Record

Each row should capture one coach turn that matters for later improvement.

Recommended fields:

- `student_key`
- `question_id`
- `exposure_id`
- `session_subject`
- `interaction_type`
- `mode`
- `learner_input`
- `coach_reply`
- `classification`
- `can_proceed`
- `suggest_next`
- `continued`
- `created_at`

## Field Meanings

### `interaction_type`

High-level purpose of the coach turn.

Initial values:

- `correct_check`
- `mistake_review`
- `follow_up`
- `session_opening`
- `quota_explanation`

### `mode`

The prompt mode or internal coach behavior used to generate the reply.

Initial values:

- `correct_check`
- `mistake_review`
- `follow_up`

### `classification`

How the learner response was interpreted.

Initial values:

- `good`
- `partial`
- `off`

### `continued`

Whether the learner chose to continue the conversation after the coach reply.

This is especially important for measuring:

- where learners still feel uncertain
- which interventions fail to close naturally

## What This Enables Later

With only this table, we can already ask:

- Which topics generate the most follow-up questions?
- Which incorrect answers lead to the longest intervention chains?
- Which coach replies tend to close the session naturally?
- Which terms repeatedly trigger definition requests?

## Growth Loop

The intended future loop is:

1. deliver question
2. capture intervention
3. store coach interaction
4. review logs
5. improve prompts, quota rules, and intervention style

## Not Needed Yet

We do not need these on day one:

- a separate analytics warehouse
- a full evaluation dashboard
- automated prompt rewriting
- per-agent fine-tuning infrastructure

Those can come later.

For now, the most important thing is to avoid losing the coaching conversation itself.

## Recommended Next Step

After the hackathon, wire the following events into `coach_interactions`:

- first intervention after answer reveal
- first learner reflection input
- every `follow_up` exchange
- whether the learner pressed `もう少し続ける`
