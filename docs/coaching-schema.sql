create schema if not exists coaching;

create table if not exists coaching.company_questions (
  id uuid primary key default gen_random_uuid(),
  source_type text not null default 'original',
  source_note text,
  review_status text not null default 'draft',
  topic text not null,
  subtopic text,
  difficulty int not null default 3 check (difficulty between 1 and 5),
  stem text not null,
  choice_1 text not null,
  choice_2 text not null,
  choice_3 text not null,
  choice_4 text not null,
  correct_choice int not null check (correct_choice between 1 and 4),
  explanation text not null,
  vocabulary_targets text[] not null default '{}'::text[],
  coaching_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_company_questions_topic on coaching.company_questions(topic);
create index if not exists idx_company_questions_review_status on coaching.company_questions(review_status);
create index if not exists idx_company_questions_difficulty on coaching.company_questions(difficulty);
create index if not exists idx_company_questions_vocab on coaching.company_questions using gin(vocabulary_targets);

create table if not exists coaching.question_exposures (
  id uuid primary key default gen_random_uuid(),
  student_key text not null,
  question_id uuid not null references coaching.company_questions(id) on delete cascade,
  channel text not null,
  purpose text not null,
  shown_at timestamptz not null default now(),
  answered_at timestamptz,
  is_correct boolean,
  created_at timestamptz not null default now()
);

create index if not exists idx_question_exposures_student on coaching.question_exposures(student_key, shown_at desc);
create index if not exists idx_question_exposures_question on coaching.question_exposures(question_id);

create table if not exists coaching.coach_interactions (
  id uuid primary key default gen_random_uuid(),
  student_key text not null,
  question_id uuid references coaching.company_questions(id) on delete set null,
  exposure_id uuid references coaching.question_exposures(id) on delete set null,
  session_subject text,
  interaction_type text not null,
  mode text not null,
  learner_input text,
  coach_reply text not null,
  classification text,
  can_proceed boolean not null default true,
  suggest_next boolean not null default false,
  continued boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_coach_interactions_student on coaching.coach_interactions(student_key, created_at desc);
create index if not exists idx_coach_interactions_question on coaching.coach_interactions(question_id, created_at desc);
create index if not exists idx_coach_interactions_type on coaching.coach_interactions(interaction_type, created_at desc);
