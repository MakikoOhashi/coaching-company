# CEO Escalation Contract

## Purpose

This document fixes the minimum contract between Coach and CEO for the Airia escalation workflow.

The goal is to keep the handoff small, legible, and demo-ready.

## Workflow Name

`coach-to-ceo-escalation`

## Input Contract

The CEO receives one escalation case from Coach.

Recommended payload:

```json
{
  "student_state": {
    "current_subject": "Civil Law",
    "current_milestone": "Basic civil law progression",
    "risk_level": "high",
    "pass_probability": 62,
    "next_action_today": "Review one weak topic and complete one main question"
  },
  "risk_level": "high",
  "pass_probability": 62,
  "recent_wrong_topic": "Condominium Ownership Act / statutory lien",
  "recent_follow_up_summary": "The learner kept asking about the scope of the lien and the meaning of third party property.",
  "daily_quota": {
    "session_mode": "stabilize",
    "question_count": 2
  },
  "escalation_reason": "repeated_stuck_pattern"
}
```

## Minimum Required Fields

- `student_state`
- `risk_level`
- `pass_probability`
- `recent_wrong_topic`
- `recent_follow_up_summary`
- `daily_quota`
- `escalation_reason`

## Escalation Reasons

Recommended values:

- `high_risk`
- `load_too_heavy`
- `load_too_light`
- `subject_switch_needed`
- `repeated_stuck_pattern`
- `coach_uncertain_next_step`

## Output Contract

The CEO returns one small strategic decision.

```json
{
  "decision": "reduce_load",
  "decision_reason": "Repeated stuck pattern on statutory lien concept indicates knowledge gap, not pacing issue.",
  "updated_next_action": "Coach to deliver targeted micro-lesson on statutory lien and reduce the daily quota to 1 question until the topic is stable.",
  "review_needed": false
}
```

## Allowed Decisions

- `stay_course`
- `reduce_load`
- `increase_load`
- `switch_subject`
- `human_review`

## Output Rules

- `decision` must be strategic, not conversational
- `decision_reason` should be short and clear
- `updated_next_action` should be practical and coach-usable
- `review_needed` should usually be `false`
- `human_review` should be rare

## Example Cases

### Case A

If the learner is slightly uncertain but overall stable:

- `decision = stay_course`

### Case B

If the learner is repeatedly stuck and overloaded:

- `decision = reduce_load`

### Case C

If the learner is repeatedly weak in one subject and another subject is currently producing better momentum:

- `decision = switch_subject`

## Human Review Boundary

`human_review` should be returned only when:

- the CEO cannot confidently determine a safe next step, or
- the case is materially exceptional

High risk alone is not enough.

## Demo Value

This contract is enough to show:

- Coach does not own all decisions
- CEO makes company-level study strategy decisions
- Airia is the visible company layer above the student product
