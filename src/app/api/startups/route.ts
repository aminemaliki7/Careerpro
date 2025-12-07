// app/api/startups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const industry = searchParams.get('industry');
    const size = searchParams.get('size');
    const fundingStage = searchParams.get('fundingStage');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('startups')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // Apply filters
    if (industry) query = query.eq('industry', industry);
    if (size) query = query.eq('size', size);
    if (fundingStage) query = query.eq('funding_stage', fundingStage);
    if (location) query = query.ilike('location', `%${location}%`);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Execute query with pagination
    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
    }

    // Map database fields to frontend format
    const startups = (data || []).map(startup => {
      console.log(`Startup: ${startup.name}, logo_url from DB:`, startup.logo_url); // DEBUG LOG
      
      return {
        id: startup.id,
        name: startup.name,
        slug: startup.slug,
        description: startup.description,
        fullDescription: startup.full_description,
        industry: startup.industry,
        size: startup.size,
        fundingStage: startup.funding_stage,
        foundedDate: startup.founded_date,
        location: startup.location,
        websiteUrl: startup.website_url,
        logoUrl: startup.logo_url, // Pass through exactly as stored
        featured: startup.featured || false,
        jobCount: startup.job_count || 0,
        createdAt: startup.created_at,
        updatedAt: startup.updated_at
      };
    });

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      startups,
      total: count || 0,
      page,
      totalPages
    });
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}