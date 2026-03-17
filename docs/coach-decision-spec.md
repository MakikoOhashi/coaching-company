# Coach Decision Spec

## Purpose

The coach decides:

- which subject to start with today
- which topic to use as the intro question
- what the main question topic should be
- how many questions to run in one session

This should feel like a coach making a small but meaningful judgment, not a fixed script.

## Minimum Inputs

The MVP coach can decide from just these four inputs:

1. `current_subject`
2. `recent_wrong_topic`
3. `recent_followup_topic`
4. `available_time`

## Decision Rules

### 1. Session Subject

- If `recent_wrong_topic` exists, prioritize that subject.
- Otherwise, use the subject from `recent_followup_topic`.
- Otherwise, use `current_subject`.

### 2. Intro Question Topic

- Use the most recent wrong topic if available.
- Otherwise, use the most recent follow-up topic.
- Otherwise, use a basic topic from `current_subject`.

### 3. Main Question Topic

- In the MVP, the main topic should usually stay in the same subject as the intro question.
- The intro question is used to stabilize understanding before the main question flow.

### 4. Question Count

- `short`: intro 1 + main 1
- `normal`: intro 1 + main 2
- `long`: intro 1 + main 3

## Output

The coach should be able to explain the decision as:

- `session_subject`
- `intro_question_topic`
- `main_question_topic`
- `question_count`
- `reason`

## Example

### Input

- `current_subject`: 民法
- `recent_wrong_topic`: 区分所有法 / 先取特権
- `recent_followup_topic`: 区分所有法 / 先取特権
- `available_time`: short

### Output

- `session_subject`: 区分所有法
- `intro_question_topic`: 先取特権
- `main_question_topic`: 区分所有法
- `question_count`: 2
- `reason`: 直近で誤答と follow-up が集中しているため

## MVP Note

The point is not to create a perfect planner.
The point is to make the start of the session feel chosen by a coach.

Even the rule:

`Start from the subject the learner struggled with most recently`

already creates a strong coaching feel.
