import { createBrowserClient } from '@supabase/ssr';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
  );
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const rawList = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
  const allowed = rawList
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

export function canAccessCurator(email?: string | null): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  return isAdminEmail(email);
}

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
