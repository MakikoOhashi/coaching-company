# Daily Quota Design

## Purpose

Today's quota should not mean "maximum volume."

It should mean:

**the minimum effective study load that most improves understanding and passing ability for the learner today.**

日本語では、次のように定義する。

**今日のノルマとは、その日の学習者にとって、理解を促しつつ合格力を最も効率よく伸ばす最小有効負荷である。**

## Design Principle

The quota engine should answer:

- How much should this learner do today?
- Which subject should they start with?
- Should they review, stabilize, or advance?

It should not optimize for:

- raw question count
- making the learner feel busy
- punishing missed days with excessive volume

## Inputs

The MVP can decide today's quota from these inputs:

### 1. Learning history

- recent study streak
- recent answered count
- recent correct rate
- recent missed days

### 2. Understanding friction

- recent wrong topic
- recent follow-up topic
- whether follow-up continued beyond one turn

### 3. Current state

- current subject
- current milestone
- risk level
- pass probability

### 4. Available time

- short
- normal
- long

## Daily Quota Modes

The coach should first decide today's mode.

### A. Recovery Mode

Use when:

- the learner missed recent study
- risk is high
- confusion is still visible

Goal:

- restore rhythm
- lower the threshold to restart

Quota shape:

- intro review: 1 question
- main question: 1 question
- follow-up: light

### B. Stabilize Mode

Use when:

- the learner is active
- one topic still feels shaky
- follow-up questions show partial understanding

Goal:

- convert shaky understanding into stable understanding

Quota shape:

- intro review: 1 question
- main questions: 1 to 2
- one short explanation check

### C. Advance Mode

Use when:

- recent answers are stable
- follow-up is short or unnecessary
- the learner has enough time

Goal:

- move forward without overloading

Quota shape:

- intro review: 1 question
- main questions: 2 to 3

## Decision Rules

### Step 1. Choose the session subject

- If there is a recent wrong topic, use that subject first.
- Otherwise, if there is a recent follow-up topic, use that subject.
- Otherwise, use the current subject.

### Step 2. Choose the daily mode

- If `risk_level = high` or there was a missed day recently:
  use `Recovery Mode`
- Else if a recent follow-up topic exists:
  use `Stabilize Mode`
- Else:
  use `Advance Mode`

### Step 3. Adjust by available time

- `short`
  - keep only the minimum structure
- `normal`
  - keep the standard structure
- `long`
  - allow one extra main question

## Output

The coach should produce:

- `session_subject`
- `session_mode`
- `intro_question_topic`
- `main_question_topic`
- `question_count`
- `target_understanding_goal`
- `reason`

## Output Meaning

### `session_subject`

Which subject the learner will work on today.

### `session_mode`

One of:

- `recovery`
- `stabilize`
- `advance`

### `intro_question_topic`

Which topic should be used to re-enter the session.

### `main_question_topic`

What the main body of the session should focus on.

### `question_count`

How many questions should be included in today's session.

### `target_understanding_goal`

What the learner should understand better after today.

Examples:

- "先取特権が当然に及ぶ対象を広げすぎない"
- "共有物の管理と変更を区別できる"
- "重要事項説明と契約成立時書面を混同しない"

### `reason`

A short explanation of why the quota was chosen.

## Example

### Input

- current_subject: 区分所有法
- recent_wrong_topic: 区分所有法 / 先取特権
- recent_followup_topic: 区分所有法 / 先取特権
- risk_level: high
- available_time: short

### Output

- session_subject: 区分所有法
- session_mode: recovery
- intro_question_topic: 先取特権
- main_question_topic: 区分所有法
- question_count: 2
- target_understanding_goal: 先取特権が当然に及ぶ対象を広げすぎない
- reason: 直近で誤答と follow-up が集中し、かつリスクが高いため

## Product Behavior

This output should influence:

- the coach opening message
- the intro question selection
- the number of questions shown today
- the summary at the end of the session

## MVP Constraint

The system does not need perfect optimization.

It only needs to make a quota choice that feels:

- intentional
- learner-aware
- lighter than a rigid fixed plan
- more effective than a generic task list
