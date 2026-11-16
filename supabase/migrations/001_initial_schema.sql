-- ============================================================================
-- Growcabulary PostgreSQL Schema & Row-Level Security (Supabase)
-- ============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  is_pro boolean default false not null,
  botanical_rank text default 'Seedling' not null,
  streak integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. DECKS TABLE (Core Tiers & Specimen Collections)
create table if not exists public.decks (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  category text not null check (category in ('core', 'specimen', 'custom')),
  emoji text default '🌱' not null,
  is_public boolean default true not null,
  is_premium boolean default false not null,
  creator_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null
);

alter table public.decks enable row level security;

create policy "Anyone can view public decks"
  on public.decks for select
  using (is_public = true or auth.uid() = creator_id);

create policy "Creators can manage their own decks"
  on public.decks for all
  using (auth.uid() = creator_id);

-- Seed default Growcabulary decks
insert into public.decks (slug, title, description, category, emoji, is_public, is_premium)
values
  ('garden', 'Pasture', 'Foundational words that are expressive but widely understood.', 'core', '🌱', true, false),
  ('meadow', 'Meadow', 'Sophisticated vocabulary found in literature and advanced reading.', 'core', '🪷', true, false),
  ('conservatory', 'Conservatory', 'Obscure and challenging terms for scholars and bookworms.', 'core', '🪻', true, true),
  ('emotions', 'Psyche & Emotions', 'Nuanced states of mind, emotional depth, character temperaments, and human psychology.', 'specimen', '🎭', true, true),
  ('philosophy', 'Philosophy & Rhetoric', 'Enduring concepts from ethics, logic, persuasion, debate, and the search for meaning.', 'specimen', '🏛️', true, true),
  ('biology', 'Natural World & Ecology', 'Evocative terms from botany, ecology, landscapes, and living systems that enrich both science and metaphor.', 'specimen', '🌿', true, true),
  ('architecture', 'Art, Design & Architecture', 'Aesthetic movements, spatial design, visual craft, and architectural marvels.', 'specimen', '🎨', true, true),
  ('statecraft', 'Society, Law & Statecraft', 'High-utility terms from diplomacy, governance, history, jurisprudence, and social dynamics.', 'specimen', '⚖️', true, true),
  ('literature', 'Literature & Poetics', 'Expressive vocabulary for narrative craft, poetic devices, irony, and literary criticism.', 'specimen', '📜', true, true)
on conflict (slug) do nothing;

-- 3. WORDS TABLE (Curated Vocabulary & Etymology Specimens)
create table if not exists public.words (
  id uuid default uuid_generate_v4() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  term text not null,
  part_of_speech text not null,
  definition text not null,
  definition2 text,
  etymology text not null,
  origin text default 'Latin' not null,
  example_sentence text not null,
  field_quote text,
  field_quote_author text,
  status text default 'approved' not null check (status in ('approved', 'staged', 'archived')),
  created_at timestamptz default now() not null,
  unique (deck_id, term)
);

alter table public.words enable row level security;

create policy "Anyone can read approved words in public decks"
  on public.words for select
  using (
    status = 'approved' and exists (
      select 1 from public.decks d
      where d.id = words.deck_id and (d.is_public = true or d.creator_id = auth.uid())
    )
  );

-- 4. USER_WORD_PROGRESS TABLE (SM-2 Spaced Repetition & Botanical Mastery)
create table if not exists public.user_word_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  word_id uuid references public.words(id) on delete cascade,
  word_term text not null, -- Denormalized fallback for seamless local-to-cloud sync
  best_score integer default 0 not null,
  repetition_count integer default 1 not null,
  ease_factor numeric(4,2) default 2.50 not null,
  interval_days integer default 1 not null,
  next_review_date timestamptz default (now() + interval '1 day') not null,
  last_watered_date timestamptz default now() not null,
  growth_stage text default 'sprout' not null check (growth_stage in ('seed', 'sprout', 'bud', 'bloom', 'perennial')),
  modes_mastered text[] default array['seed-sprout']::text[] not null,
  is_composted boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, word_term)
);

alter table public.user_word_progress enable row level security;

create policy "Users can view their own word progress"
  on public.user_word_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own word progress"
  on public.user_word_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own word progress"
  on public.user_word_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own word progress"
  on public.user_word_progress for delete
  using (auth.uid() = user_id);
