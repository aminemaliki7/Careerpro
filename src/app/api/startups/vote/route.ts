import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to vote' }, { status: 401 });
  }

  let startupId: string;
  let value: number;
  try {
    const body = await request.json();
    startupId = typeof body.startupId === 'string' ? body.startupId.trim() : '';
    value = body.value;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!startupId || startupId.length > 200 || ![-1, 0, 1].includes(value)) {
    return NextResponse.json({ error: 'Invalid vote' }, { status: 400 });
  }

  const { data: startup, error: startupError } = await supabaseAdmin
    .from('startups')
    .select('id')
    .eq('id', startupId)
    .eq('status', 'approved')
    .maybeSingle();

  if (startupError) {
    console.error('Error checking startup for vote:', startupError);
    return NextResponse.json({ error: 'Failed to verify startup' }, { status: 500 });
  }
  if (!startup) {
    return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
  }

  const voteQuery = supabaseAdmin
    .from('startup_votes')
    .delete()
    .eq('startup_id', startupId)
    .eq('user_id', userId);

  const { error: voteError } = value === 0
    ? await voteQuery
    : await supabaseAdmin
        .from('startup_votes')
        .upsert(
          { startup_id: startupId, user_id: userId, vote_value: value },
          { onConflict: 'startup_id,user_id' }
        );

  if (voteError) {
    console.error('Error saving startup vote:', voteError);
    return NextResponse.json({ error: 'Failed to save vote' }, { status: 500 });
  }

  const [{ data: scoreRow, error: scoreError }, { data: voteRow, error: userVoteError }] = await Promise.all([
    supabaseAdmin
      .from('startups')
      .select('vote_score')
      .eq('id', startupId)
      .single(),
    supabaseAdmin
      .from('startup_votes')
      .select('vote_value')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle(),
  ]);

  if (scoreError || userVoteError) {
    console.error('Error loading startup vote result:', scoreError || userVoteError);
    return NextResponse.json({ error: 'Vote saved, but failed to load updated score' }, { status: 500 });
  }

  return NextResponse.json({
    vote: voteRow?.vote_value || 0,
    voteScore: scoreRow.vote_score,
  });
}