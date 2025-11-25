// src/app/api/podcast/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Fetch stats for specific episode
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

// Get stats for all episodes
export async function POST(request: NextRequest) {
  try {
    const { episodeSlugs } = await request.json();

    if (!episodeSlugs || !Array.isArray(episodeSlugs)) {
      return NextResponse.json(
        { error: 'Episode slugs array is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('podcast_stats')
      .select('*')
      .in('episode_slug', episodeSlugs);

    if (error) {
      throw error;
    }

    // Create a map of slug to stats
    const statsMap = (data || []).reduce((acc, stat) => {
      acc[stat.episode_slug] = stat;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(statsMap);
  } catch (error) {
    console.error('Error fetching podcast stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcast stats' },
      { status: 500 }
    );
  }
}