-- ============================================================================
-- Growcabulary Scored Rounds & High Score History (Supabase)
-- ============================================================================

create table if not exists public.scored_rounds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  game_mode text not null check (game_mode in ('seed-sprout', 'field-notes')),
  difficulty text not null default 'all' check (difficulty in ('all', 'garden', 'meadow', 'conservatory')),
  topic text not null default 'all',
  score integer not null default 0,
  words_count integer not null default 0,
  clean_count integer not null default 0,
  assisted_count integer not null default 0,
  missed_count integer not null default 0,
  created_at timestamptz default now() not null
);

create index if not exists scored_rounds_user_created_idx
  on public.scored_rounds (user_id, created_at desc);

alter table public.scored_rounds enable row level security;

drop policy if exists "Users can view their own scored rounds" on public.scored_rounds;
create policy "Users can view their own scored rounds"
  on public.scored_rounds for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own scored rounds" on public.scored_rounds;
create policy "Users can insert their own scored rounds"
  on public.scored_rounds for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own scored rounds" on public.scored_rounds;
create policy "Users can delete their own scored rounds"
  on public.scored_rounds for delete
  using (auth.uid() = user_id);
