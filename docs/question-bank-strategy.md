# Question Bank Strategy

## Core Principle

The Coaching Company should not depend on copying full past exam questions directly into the product.

Instead, it should build and manage its own internal question bank designed for exam-level coaching.

## Why This Matters

Using full past questions directly creates multiple risks:

- copyright risk
- unclear reuse boundaries
- unstable product policy
- difficulty controlling quality

Even small edits to existing questions are not a strong long-term strategy.

The safer and more durable path is to create a company-owned question bank inspired by important exam topics and patterns.

## Recommended Direction

The Company should aim for:

- original questions
- past-exam-level difficulty
- topic coverage aligned to the real exam
- coaching-friendly explanations
- vocabulary and concept hooks for intervention

In other words:

- not "the exact past exam"
- but "questions that train the learner to solve past-exam-level problems"

## Role Of AI

AI can help generate drafts, variants, and explanations.

However, the Company should not rely on fully free-form generation at runtime for its core question supply.

Reasons:

- legal safety is harder to control
- quality varies
- duplication becomes harder to manage
- explanations and difficulty may drift

So the recommended model is:

- AI helps create question drafts
- humans or internal review rules approve them
- approved questions are stored in a managed question bank
- the product serves from that bank

## Recommended Storage Policy

Yes, the Company should store its question bank in the database.

The question bank should be treated as a product asset, not as temporary generated output.

## Suggested Question Bank Fields

- `question_id`
- `source_type`
- `source_note`
- `review_status`
- `topic`
- `subtopic`
- `difficulty`
- `stem`
- `choice_1`
- `choice_2`
- `choice_3`
- `choice_4`
- `correct_choice`
- `explanation`
- `vocabulary_targets`
- `coaching_note`
- `created_at`
- `updated_at`

## Important Distinction

LINE can continue using its existing fixed, simpler question flow.

The Coaching Company should move toward a different asset model:

- structured
- reviewed
- premium
- suitable for session-based coaching

## Business Value

A managed question bank gives the Company:

- stronger legal safety
- better product consistency
- reusable premium assets
- smarter sequencing across learners
- better intervention design

This is a stronger long-term foundation than relying on runtime-generated questions alone.
