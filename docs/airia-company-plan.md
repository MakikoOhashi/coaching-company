# Airia Company Plan

## Purpose

Airia is the operating layer of the coaching company.

The product already handles the student-facing session:

- start
- intro
- question
- intervention
- summary

Airia should now handle the company-side judgment:

- when Coach can continue alone
- when CEO should review the case
- when a human should be involved
- when the company should update strategy

The goal is not to move all product logic into Airia.

The goal is to make the company visible.

## Step 1: Company Judgment Points

The company should explicitly judge the following:

1. Can Coach continue with the current plan?
2. Does the learner need a lighter or heavier daily load?
3. Should the subject focus change?
4. Is the learner at a risk level that needs CEO review?
5. Is the case serious enough for human review?

These are the minimum useful company-level decisions.

## Step 2: Minimum Airia Workflows

For the hackathon, keep the Airia layer to two workflows.

### Workflow A

`coach-to-ceo-escalation`

Purpose:

- CEO reviews high-risk or uncertain cases
- CEO returns a strategic decision

### Workflow B

`daily-review`

Purpose:

- company reviews the learner state once per day
- company decides whether the current plan still makes sense

This is enough to show that the company exists above the product.

## Step 3: Coach -> CEO Payload

When Coach escalates, send the minimum useful packet.

Recommended fields:

- `student_key`
- `student_state`
- `recent_question_topic`
- `recent_wrong_topic`
- `recent_follow_up_summary`
- `risk_level`
- `pass_probability`
- `daily_quota`
- `escalation_reason`

### Notes

`recent_follow_up_summary` should be short.

It does not need the full chat transcript.

The point is to tell the CEO:

- what the learner got stuck on
- what the coach already tried
- why the coach is escalating

## Step 4: CEO Output

The CEO should return a small set of strategic decisions.

Recommended values:

- `stay_course`
- `reduce_load`
- `increase_load`
- `switch_subject`
- `human_review`

The CEO should also return:

- `decision_reason`
- `updated_next_action`
- `review_needed`

This keeps the output visible and easy to explain in the demo.

## Step 5: Human-in-the-Loop Boundary

The human should not appear for routine cases.

Human review should happen only when one of these is true:

- `risk_level = high` and the learner is not recovering
- the learner repeatedly fails to continue
- strategy change would materially alter the plan
- the coach or CEO is uncertain about the safe next step

This keeps the company structure clean:

- learner -> coach
- coach -> CEO
- CEO -> human only if needed

## Step 6: Demo Story

The demo should show the product first, then the company.

### Product side

1. learner starts session
2. coach asks available time
3. learner solves question
4. coach explains and follows up
5. day closes naturally

### Company side

1. show Airia workflow canvas
2. explain that high-risk cases are escalated
3. show CEO decision output
4. show where human review can enter

This order makes the company feel like the hidden operating layer behind a working product.

## Recommended Build Order For Today

1. Fix the escalation boundary
2. Fix the payload format
3. Fix the CEO output format
4. Build the Airia workflow canvas
5. Connect one visible example case

## What Not To Do Today

- Do not move routine coaching into Airia
- Do not build many workflows just to look complex
- Do not build a separate admin dashboard
- Do not over-model personalities

The hackathon version only needs enough company structure to be legible.

## Definition Of Done

Airia is "ready enough" when:

- one CEO escalation workflow exists
- one daily review workflow exists
- the payload is clear
- the CEO outputs are clear
- the human boundary is clear
- the demo can explain why Airia is the company layer
