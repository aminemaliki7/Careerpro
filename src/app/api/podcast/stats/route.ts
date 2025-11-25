// src/app/api/podcast/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: fetch stats for a single episode
export async function GET(request: NextRequest) {
  try {
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

    // Upsert stats: increment total_listens & total_duration_seconds
    const { data, error } = await supabase
      .from('podcast_stats')
      .upsert(
        {
          episode_slug: episodeSlug,
          total_listens: 1,
          total_duration_seconds: duration,
        },
        { onConflict: 'episode_slug', ignoreDuplicates: false }
      )
      .select();

    if (error) throw error;

    // If exists, increment instead of overwrite
    if (data && data.length > 0) {
      await supabase
        .from('podcast_stats')
        .update({
          total_listens: supabase.rpc('increment', { x: 1 }), // or use normal arithmetic
          total_duration_seconds: supabase.rpc('increment', { x: duration }),
        })
        .eq('episode_slug', episodeSlug);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating/fetching podcast stats:', error);
    return NextResponse.json(
      { error: 'Failed to update/fetch podcast stats' },
      { status: 500 }
    );
  }
}
