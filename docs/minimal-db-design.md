# Minimal DB Design

## Goal

Define the smallest database shape needed for the coaching-company MVP.

This design assumes:

- real learner data lives in the database
- `common-ai-api` is the main backend
- Airia orchestrates higher-level workflows
- existing kanrigyomu learning data may already exist in a shared Supabase project

## Design Principle

Do not model the whole company at once.

Start with the minimum set required to:

- know who the learner is
- know what the learner has done
- know what the current coaching state is
- know what the system decided

## Recommended Schema Direction

Use a dedicated schema such as `coaching`.

Keep existing kanrigyomu tables separate.

If existing tables remain in `public`, the coaching-company tables should still be isolated under their own schema where possible.

## Minimum Tables

### 1. `students`

Stores the learner identity and stable coaching profile.

Suggested fields:

- `id`
- `external_user_key`
- `display_name`
- `exam_name`
- `target_date`
- `timezone`
- `locale`
- `available_weekly_hours`
- `typical_session_minutes`
- `created_at`
- `updated_at`

### 2. `study_logs`

Stores actual study activity and imported progress events.

Suggested fields:

- `id`
- `student_id`
- `source`
- `source_ref`
- `studied_at`
- `subject`
- `topic`
- `duration_minutes`
- `correct_count`
- `incorrect_count`
- `accuracy_rate`
- `notes`
- `created_at`

This table can receive mapped data from the existing kanrigyomu answer and assignment flow.

### 3. `student_state`

Stores the current operating state for one learner.

Suggested fields:

- `student_id`
- `current_subject`
- `current_block`
- `current_milestone`
- `next_milestone`
- `today_goal`
- `risk_level`
- `risk_reason`
- `pass_probability`
- `probability_confidence`
- `last_coached_at`
- `updated_at`

This table represents the live state that the coach sees.

### 4. `roadmaps`

Stores the current learning roadmap and its revisions.

Suggested fields:

- `id`
- `student_id`
- `version`
- `status`
- `strategy_summary`
- `primary_focus`
- `secondary_focus`
- `target_window`
- `created_by`
- `created_at`

### 5. `ceo_decisions`

Stores strategic and escalation decisions made by the CEO layer.

Suggested fields:

- `id`
- `student_id`
- `decision_type`
- `observed_signal`
- `decision_summary`
- `reasoning`
- `requires_human_review`
- `effective_from`
- `created_at`

### 6. `coach_sessions`

Stores session-level coaching interactions.

Suggested fields:

- `id`
- `student_id`
- `started_at`
- `ended_at`
- `available_minutes`
- `session_goal`
- `coach_summary`
- `student_report`
- `follow_up_required`
- `created_at`

### 7. `experience_notes`

Stores reusable organizational learning without changing the agent identity itself.

Suggested fields:

- `id`
- `scope`
- `student_id` nullable
- `pattern_type`
- `pattern_name`
- `observation`
- `recommended_action`
- `evidence_level`
- `created_at`

This can cover:

- coach playbook notes
- effective interventions
- risk patterns
- CEO-level reusable decisions

## What Not To Add Yet

Do not add these early unless they become clearly necessary:

- many-to-many agent staffing tables
- complex permissions tables
- granular marketing analytics schema
- large event-sourcing infrastructure
- full audit framework beyond simple decision logs

## Relationship to Existing Kanrigyomu Data

The existing kanrigyomu tables already provide useful signals:

- user identity
- current block
- cursor position
- streak count
- answer history
- daily assignments

For the MVP, it is reasonable to:

- keep those source tables as they are
- map them into `study_logs` and `student_state`
- add coaching-company specific tables only where existing data is insufficient

## MVP Recommendation

If we want the smallest possible implementation, start with only these four:

1. `students`
2. `study_logs`
3. `student_state`
4. `ceo_decisions`

Everything else can be added after the first end-to-end demo works.
