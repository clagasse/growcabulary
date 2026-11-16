-- ============================================================================
-- Growcabulary Feedback Table (Supabase)
-- ============================================================================

create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  user_email text,
  category text default 'general' not null check (category in ('bug', 'word-suggestion', 'feature', 'general')),
  message text not null,
  page_url text,
  created_at timestamptz default now() not null
);

alter table public.feedback enable row level security;

-- Allow anyone (including guests) to submit feedback, while keeping reads restricted to admin/service role
drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);
