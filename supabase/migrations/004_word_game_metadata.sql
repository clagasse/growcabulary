-- ============================================================================
-- Add Game Metadata Columns to public.words (Supabase)
-- Stores Curator-synced topic, Field Notes quotes, and alternative fits
-- alongside each vocabulary specimen.
-- ============================================================================

alter table public.words
  add column if not exists topic text default 'general' not null,
  add column if not exists field_quote text,
  add column if not exists field_quote_author text,
  add column if not exists field_alternatives jsonb;
