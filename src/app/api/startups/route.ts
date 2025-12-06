// app/api/startups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { StartupFilters, StartupListResponse } from '@/types/startup';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters with guaranteed defaults
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

    const filters: StartupFilters = {
      industry: searchParams.get('industry') as any,
      size: searchParams.get('size') as any,
      fundingStage: searchParams.get('fundingStage') as any,
      location: searchParams.get('location') || undefined,
      search: searchParams.get('search') || undefined,
      page,
      limit,
    };

    // Build query — ONLY approved startups
    let query = supabase
      .from('startups')
      .select('*', { count: 'exact' })
      .eq('status', 'approved'); // ✅ FILTER APPROVED ONLY

    // Apply filters
    if (filters.industry) query = query.eq('industry', filters.industry);
    if (filters.size) query = query.eq('size', filters.size);
    if (filters.fundingStage) query = query.eq('funding_stage', filters.fundingStage);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch startups' },
        { status: 500 }
      );
    }

    const response: StartupListResponse = {
      startups: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('startups')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create startup' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
