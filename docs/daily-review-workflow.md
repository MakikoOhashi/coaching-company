# Daily Review Workflow

## Purpose

This workflow lets the company review whether the learner's current study plan still makes sense.

It is the second Airia workflow after CEO escalation.

Workflow name:

`daily-review`

## Role

The daily review is not a tutoring flow.

It is a company review flow that asks:

- should the current plan continue
- should the learner's load change
- should the company change subject focus
- should the learner be escalated to CEO review

## Input

Recommended minimum payload:

```json
{
  "student_key": "demo-student",
  "student_state": {
    "current_subject": "Civil Law",
    "current_milestone": "Basic civil law progression",
    "risk_level": "medium",
    "pass_probability": 74,
    "next_action_today": "Continue with one intro question and two main questions in Civil Law"
  },
  "daily_quota": {
    "session_mode": "advance",
    "question_count": 3
  },
  "recent_performance": {
    "recent_wrong_topic": "Civil Law / shared ownership",
    "recent_follow_up_summary": "One short clarification question, then correct continuation.",
    "completed_sessions": 3,
    "streak_count": 4
  }
}
```

## Review Questions

The daily review should answer only these:

1. Is the current plan still valid?
2. Does the load need to change?
3. Does the main subject need to change?
4. Does this case need CEO escalation?

## Output

Recommended output:

```json
{
  "plan_status": "continue",
  "recommended_action": "keep_current_plan",
  "recommended_subject": "Civil Law",
  "recommended_quota": 3,
  "needs_ceo_review": false,
  "review_summary": "The learner remains stable. Continue the current subject and daily quota."
}
```

## Allowed Plan Status

- `continue`
- `adjust`
- `escalate`

## Allowed Recommended Action

- `keep_current_plan`
- `reduce_load`
- `increase_load`
- `switch_subject`
- `send_to_ceo`

## Rules

- prefer `continue` when the learner is still progressing
- do not escalate to CEO unless the next plan is genuinely unclear
- use `switch_subject` only when current subject repetition is no longer productive
- keep the review short and operational

## Minimum Demo Story

For the hackathon, this workflow only needs to show:

- the company does a daily check
- it can keep the current plan or adjust it
- it can send a case upward to CEO when needed

That is enough to make Airia feel like the company layer behind the product.
