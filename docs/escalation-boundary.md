# Escalation Boundary

## Purpose

This document defines where routine coaching ends and where company-level review begins.

The goal is to keep the structure legible:

- Coach handles normal session guidance
- CEO handles strategy changes and unclear risk cases
- Human review happens only for exceptional decisions

## Default Principle

The learner should stay with Coach unless there is a clear reason to escalate.

Routine coaching should not go to Airia CEO review by default.

Escalation should happen only when the next best action is no longer obvious at the coach level.

## Coach Handles

Coach should continue alone when the case is still routine.

Typical coach-owned cases:

- normal question flow
- ordinary follow-up after a wrong answer
- short recovery after one missed day
- normal daily quota adjustment within a narrow range
- clarifying one legal term in the context of the current question
- continuing the same subject with the same study plan

## Escalate To CEO

Coach should escalate to CEO when a strategic decision is needed.

Typical CEO-owned cases:

- `risk_level = high`
- pass probability is falling and recovery is unclear
- the learner cannot keep up with the current daily load
- the learner appears under-challenged and the pace may need to increase
- the main subject focus may need to change
- the learner is repeatedly stuck on the same topic across sessions
- the coach is unsure whether to continue, reduce, or redirect the plan

## Escalation Reasons

For the hackathon build, keep escalation reasons small and explicit.

Recommended values:

- `high_risk`
- `load_too_heavy`
- `load_too_light`
- `subject_switch_needed`
- `repeated_stuck_pattern`
- `coach_uncertain_next_step`

These reasons should be visible in the payload.

## CEO Returns

The CEO should return a small strategic decision, not a full coaching script.

Recommended decisions:

- `stay_course`
- `reduce_load`
- `increase_load`
- `switch_subject`
- `human_review`

The CEO should also return:

- `decision_reason`
- `updated_next_action`
- `review_needed`

## Human Review Boundary

Human review should stay rare.

The case should go to a human only when one of these is true:

- the learner remains high-risk after CEO review
- the learner repeatedly cannot continue for non-routine reasons
- the company is about to make a major plan change with meaningful consequence
- the CEO cannot confidently determine a safe next step

## What Should Not Escalate

The following should not escalate by default:

- one wrong answer
- one follow-up question
- a single term-definition request
- one short missed-study report
- ordinary explanation or encouragement

If these common cases escalate too easily, the company layer becomes noisy and unclear.

## Demo Rule

For the hackathon demo, a case is good enough to show CEO escalation when:

- the learner looks meaningfully at risk, or
- the coach is no longer sure whether the plan should continue as-is

This keeps the Airia layer visible without overcomplicating the product.

## Practical Test

Use this question:

`Can Coach still decide the next step confidently from the current session and state?`

If yes:

- stay with Coach

If no:

- escalate to CEO
