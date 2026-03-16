# Coaching Schema Notes

## Purpose

This schema is the first dedicated Company-side data area for premium coaching assets.

It should stay separate from the existing LINE-side fixed question tables.

## Initial Tables

### `coaching.company_questions`

Stores the Company's managed question bank.

Use this for:

- original questions
- past-exam-level questions
- reviewed and reusable assets

### `coaching.question_exposures`

Stores where and why a question was shown.

Use this for:

- avoiding careless duplication
- allowing intentional review
- tracking premium question usage separately from LINE usage

## Why Start Small

The purpose of this first schema is not to model the entire company.

It is to create a clean starting place for:

- premium question assets
- channel-aware question tracking

Everything else can be added later.
