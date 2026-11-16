import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { createClient as createServerSupabaseClient } from '../../../utils/supabase/server';

type FeedbackCategory = 'bug' | 'word-suggestion' | 'feature' | 'general';

const VALID_CATEGORIES = new Set<FeedbackCategory>([
  'bug',
  'word-suggestion',
  'feature',
  'general',
]);

const GITHUB_ISSUES_URL = 'https://github.com/clagasse/growcabulary/issues/new';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      category?: string;
      message?: string;
      userEmail?: string;
      pageUrl?: string;
    };

    const category: FeedbackCategory = VALID_CATEGORIES.has(body.category as FeedbackCategory)
      ? (body.category as FeedbackCategory)
      : 'general';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const replyEmail =
      typeof body.userEmail === 'string' ? body.userEmail.trim().slice(0, 200) : '';
    const pageUrl =
      typeof body.pageUrl === 'string' ? body.pageUrl.trim().slice(0, 300) : '';

    if (message.length < 5) {
      return NextResponse.json(
        { error: 'Please write at least 5 characters of feedback.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Please keep feedback under 2,000 characters.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl.includes('your-project-id') || (!serviceKey && !anonKey)) {
      return NextResponse.json(
        {
          error: 'Cloud feedback database is not configured yet.',
          fallbackUrl: GITHUB_ISSUES_URL,
        },
        { status: 503 }
      );
    }

    let signedInUserId: string | null = null;
    let signedInEmail: string | null = null;
    try {
      const serverClient = await createServerSupabaseClient();
      const {
        data: { user },
      } = await serverClient.auth.getUser();
      signedInUserId = user?.id || null;
      signedInEmail = user?.email || null;
    } catch {
      // Guest submission is allowed
    }

    const writer = serviceKey
      ? createSupabaseAdminClient(supabaseUrl, serviceKey)
      : await createServerSupabaseClient();

    const { error: insertError } = await writer.from('feedback').insert({
      user_id: signedInUserId,
      user_email: replyEmail || signedInEmail || null,
      category,
      message,
      page_url: pageUrl || null,
    });

    if (insertError) {
      return NextResponse.json(
        {
          error:
            insertError.message.includes('relation') || insertError.message.includes('feedback')
              ? 'Feedback table is not yet initialized in Supabase. Run 002_feedback_table.sql or use GitHub Issues.'
              : insertError.message,
          fallbackUrl: GITHUB_ISSUES_URL,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Invalid feedback request.', fallbackUrl: GITHUB_ISSUES_URL },
      { status: 400 }
    );
  }
}
