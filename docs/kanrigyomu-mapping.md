# Kanrigyomu Mapping

## Goal

Map the existing kanrigyomu learning data into the coaching-company MVP data model.

This document is for structure only.
It does not store real learner values.

## Existing Source Tables

Current source data already exists in:

- `kanrigyomu_users`
- `kanrigyomu_answers`
- `kanrigyomu_daily_assignments`
- `kanrigyomu_questions`

These provide enough signal to initialize the first real learner state.

## Target MVP Tables

The current MVP target is:

- `students`
- `study_logs`
- `student_state`
- `ceo_decisions`

## Mapping Overview

### 1. `kanrigyomu_users` -> `students`

Primary stable learner profile should come from `kanrigyomu_users`.

Suggested mapping:

- `kanrigyomu_users.id` -> `students.external_user_key` or source-linked field
- `kanrigyomu_users.locale` -> `students.locale`
- `kanrigyomu_users.timezone` -> `students.timezone`
- `kanrigyomu_users.exam_type` -> `students.exam_name`

Fields not currently present in the source and likely added manually or separately:

- `students.display_name`
- `students.target_date`
- `students.available_weekly_hours`
- `students.typical_session_minutes`

## 2. `kanrigyomu_answers` + `kanrigyomu_questions` -> `study_logs`

Answer history is the strongest existing source for study activity.

Suggested mapping:

- `kanrigyomu_answers.user_id` -> `study_logs.student_id`
- `kanrigyomu_answers.answered_at` -> `study_logs.studied_at`
- `kanrigyomu_questions.block_number` -> `study_logs.subject` or roadmap block field
- `kanrigyomu_questions.tags` -> `study_logs.topic`
- `kanrigyomu_answers.is_correct` -> contributes to `correct_count` / `incorrect_count`
- `kanrigyomu_questions.id` or assignment record -> `study_logs.source_ref`
- fixed source label -> `study_logs.source = "kanrigyomu"`

Possible derived values:

- `accuracy_rate`
- `correct_count`
- `incorrect_count`

If one log row represents one answer event:

- correct answer -> `correct_count = 1`, `incorrect_count = 0`
- incorrect answer -> `correct_count = 0`, `incorrect_count = 1`

## 3. `kanrigyomu_users` + progress snapshot -> `student_state`

This is where the current operating state is derived.

Suggested mapping:

- `kanrigyomu_users.current_block` -> `student_state.current_block`
- block label derived from block number -> `student_state.current_subject`
- progress snapshot -> `student_state.current_milestone`
- next roadmap step -> `student_state.next_milestone`
- streak and recent performance -> part of `student_state.risk_level`
- derived probability logic -> `student_state.pass_probability`
- derived confidence logic -> `student_state.probability_confidence`

This table should not simply mirror source tables.
It should represent the current coaching view of the learner.

## 4. `kanrigyomu_daily_assignments` -> `student_state` and `study_logs`

Daily assignments are useful for understanding execution reliability.

Suggested use:

- `date`, `sent_at`, `answered_at` -> infer consistency
- unanswered assignments -> risk signal
- assignment count over time -> adherence signal

These values may be:

- aggregated into `student_state.risk_level`
- copied into `study_logs` as supporting operational events if needed

## 5. `ceo_decisions`

This table does not currently exist in kanrigyomu source data.

It should be newly created for the coaching-company product.

It stores decisions such as:

- shift focus to civil law
- reduce workload because follow-through is dropping
- raise risk level after repeated missed sessions
- request human review

## Derived Fields

Some coaching-company fields should not come from a single source field.

They should be derived from multiple signals.

Examples:

- `student_state.risk_level`
  from streak, unanswered assignments, recent accuracy
- `student_state.pass_probability`
  from progress, accuracy, time remaining, consistency
- `student_state.current_milestone`
  from current block, cursor position, and roadmap interpretation

## Important Distinction

The source tables describe raw learning activity.

The coaching-company tables describe interpreted coaching state.

That means:

- source data stays factual
- target state becomes operational

This distinction is one of the product's main differentiators.

## MVP Recommendation

For the first implementation:

1. Reuse `kanrigyomu_users` as the learner source.
2. Reuse `kanrigyomu_answers` as the core activity source.
3. Build `student_state` from derived logic rather than direct copying.
4. Add `ceo_decisions` as the first truly new coaching-company table.

This is enough to create the first real learner-driven demo.
