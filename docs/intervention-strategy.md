# Intervention Strategy

## Purpose

The Coaching Company should not behave like a simple answer checker.

After a learner misses a question, the coach should briefly identify what kind of understanding is missing and guide the learner through one focused follow-up.

The goal is:

- not to over-explain
- not to turn the session into passive memorization
- not to ask the learner to choose what to review

The coach should decide the next short intervention.

## Core Principle

After a miss, the system should classify the gap into one of three types:

1. vocabulary gap
2. issue-spotting gap
3. misconception gap

The coach should then give one short intervention, not a long lecture.

## 1. Vocabulary Check

Use this when:

- the learner seems shaky on a legal term
- the wording of the choices may be driving the miss
- understanding of the term itself is unclear

Example intervention:

- `ここは用語理解を確認しましょう。まず「先取特権」の意味を短く説明してみてください。`

Typical targets:

- 先取特権
- 区分所有権
- 敷地利用権
- 管理組合法人
- 共益費用

## 2. Issue-Spotting Check

Use this when:

- the learner is not seeing what the question is actually asking
- the problem is about the legal issue or scope, not a single word
- the learner needs the axis of the question clarified

Example intervention:

- `ここは論点を確認しましょう。この問題で問われているのは「先取特権が何に及ぶか」です。そこを意識して、もう一度考えてみましょう。`

Typical targets:

- what property the right reaches
- what type of claim is covered
- whose rights are being discussed

## 3. Misconception Correction

Use this when:

- there is a specific wrong belief visible in the miss
- one choice shows the misunderstanding clearly
- the learner needs a short correction before moving on

Example intervention:

- `ここは「当然に一般先取特権だけが認められる」と考えたのがズレでした。管理者や管理組合法人にも、区分所有権等を対象とする特則が及ぶ場面があります。まずその点を押さえましょう。`

## Decision Order

For the MVP, the coach should choose in this order:

1. if there is a clear misconception, use misconception correction
2. if the question axis was missed, use issue-spotting check
3. if the main problem looks like terminology, use vocabulary check

This keeps the intervention short and useful.

## Product Fit

This fits the core product concept because:

- the learner is not asked to decide what to review
- the coach carries the diagnosis burden
- each miss leads to a concrete next step
- the product feels like guided coaching rather than static drill

## MVP Rule

For the first version:

- pick only one intervention type after each miss
- keep it to one short coach message
- follow it with either:
  - one short explanation
  - one same-theme follow-up question
  - one quick definition check
