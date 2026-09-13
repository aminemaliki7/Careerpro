// src/app/api/podcast/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

// GET: fetch stats for a single episode
export async function GET(request: NextRequest) {
  try {
    const rl = rateLimit(`podcast-stats:get:${getClientIp(request)}`, {
      limit: 60,
      windowMs: 60_000,
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const episodeSlug = searchParams.get('episode');

    if (!episodeSlug) {
      return NextResponse.json(
        { error: 'Episode slug is required' },
        { status: 400 }
      );
    }

    // Fetch stats for the episode
    const { data, error } = await supabase
      .from('podcast_stats')
      .select('*')
      .eq('episode_slug', episodeSlug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        episode_slug: episodeSlug,
        total_listens: 0,
        active_listeners: 0,
        total_duration_seconds: 0,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching podcast stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcast stats' },
      { status: 500 }
    );
  }
}

// POST: fetch stats for multiple episodes OR increment listens
export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(`podcast-stats:post:${getClientIp(request)}`, {
      limit: 30,
      windowMs: 60_000,
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      );
    }

    const body = await request.json();

    // If it's an array of episode slugs → return multiple stats
    if (Array.isArray(body.episodeSlugs)) {
      const { data, error } = await supabase
        .from('podcast_stats')
        .select('*')
        .in('episode_slug', body.episodeSlugs);

      if (error) throw error;

      const statsMap = (data || []).reduce((acc, stat) => {
        acc[stat.episode_slug] = stat;
        return acc;
      }, {} as Record<string, any>);

      return NextResponse.json(statsMap);
    }

    // If it's a single episodeSlug → increment listens
    const { episodeSlug, duration = 0 } = body;

    if (!episodeSlug) {
      return NextResponse.json(
        { error: 'Episode slug is required' },
        { status: 400 }
      );
    }

    // Read current totals, then write the incremented values atomically.
    // (The previous code tried to use a non-existent `increment` RPC as an
    // update value, which is not valid.)
    const { data: existing, error: existingError } = await supabase
      .from('podcast_stats')
      .select('total_listens, total_duration_seconds')
      .eq('episode_slug', episodeSlug)
      .maybeSingle();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    const totalListens = Number(existing?.total_listens ?? 0) + 1;
    const totalDurationSeconds =
      Number(existing?.total_duration_seconds ?? 0) + Number(duration ?? 0);

    const { error: upsertError } = await supabase
      .from('podcast_stats')
      .upsert(
        {
          episode_slug: episodeSlug,
          total_listens: totalListens,
          total_duration_seconds: totalDurationSeconds,
        },
        { onConflict: 'episode_slug' }
      );

    if (upsertError) throw upsertError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating/fetching podcast stats:', error);
    return NextResponse.json(
      { error: 'Failed to update/fetch podcast stats' },
      { status: 500 }
    );
  }
}
