# Workflow

## Primary Trigger

The system starts when there is a customer interaction.

Examples:

- the student asks what to do today
- the student reports study results
- the student asks whether they are still on track

## Normal Flow

1. Student interaction is received.
2. Coach handles the request.
3. Progress and state are updated.
4. Data signals are refreshed if needed.
5. CEO is consulted only when the case crosses an escalation boundary.

## Escalation Flow

1. Coach detects uncertainty, risk, or exception.
2. Coach sends the case to the CEO.
3. CEO decides whether to:
   - update strategy
   - return a new instruction to the coach
   - escalate to a human

## Daily Operation

The day-to-day system should aim to automate:

- today plan generation
- missed-day recovery suggestions
- study report intake
- roadmap updates
- pass-likelihood estimation

## Strategic Review

Some workflows should happen on a slower cadence:

- daily CEO review for high-risk students
- weekly progress review
- monthly marketing review

These are strong candidates for Airia-managed workflows.
