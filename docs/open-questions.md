# Open Questions

## Product

- Should the first demo focus on one student only?
- Should the first target exam be fixed to a single qualification?
- How visible should the AI CEO be in the UI?

## UX

- Should the first interface be mostly dashboard-based rather than chat-based?
- Should the coach speak through an avatar or only text at first?
- How much English support is needed in the first version?
- How proactive should the coach be before the user asks a question?
- In the real product, where should the learner end a session explicitly with a `今日はここで終わり` style control?
- If session-end controls are added later, should lightweight progress feedback be shown at the same time?

## Architecture

- Which workflows should stay in code versus Airia?
- What is the minimum useful memory model for one student?
- Should Airia be used for CEO-only workflows or also for human escalation?

## Evaluation

- How should pass likelihood be estimated in the first version?
- What counts as a high-risk case that must be escalated?
- What evidence should be shown to justify strategy changes?
- How should draft exam-style questions be reviewed and replaced when legal wording or difficulty feels weak?
- What review rule should decide whether a generated exam-style question stays, gets edited, or gets removed from the bank?
