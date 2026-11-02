// src/app/api/startups/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { requireCompanyUser } from '@/lib/auth/authorization';
import { startupSubmissionSchema } from '@/schemas';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const { data, error } = await supabase
      .from('startups')
      .select('id,name,slug,description,full_description,industry,size,funding_stage,founded_date,location,website_url,logo_url,featured,job_count,status')
      .eq('slug', slug)
      .eq('status', 'approved')
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch startup' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching startup:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const authResult = await requireCompanyUser();
  if (authResult.response) return authResult.response;

  const { slug } = await context.params;
  const { data: ownedStartup, error: lookupError } = await supabaseAdmin
    .from('startups')
    .select('id,name,status')
    .eq('slug', slug)
    .eq('owner_id', authResult.userId)
    .maybeSingle();

  if (lookupError) {
    console.error('Error checking startup ownership:', lookupError);
    return NextResponse.json({ error: 'Failed to load startup profile' }, { status: 500 });
  }
  if (!ownedStartup) {
    return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = startupSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid startup profile' },
      { status: 400 }
    );
  }

  if (parsed.data.name !== ownedStartup.name) {
    return NextResponse.json(
      { error: 'Startup names cannot be changed from profile editing. Contact Hirely for help.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('startups')
    .update({
      description: parsed.data.description,
      full_description: parsed.data.fullDescription || null,
      industry: parsed.data.industry,
      size: parsed.data.size,
      funding_stage: parsed.data.fundingStage,
      founded_date: parsed.data.foundedDate,
      location: parsed.data.location,
      website_url: parsed.data.websiteUrl,
      logo_url: parsed.data.logoUrl || null,
      contact_email: parsed.data.contactEmail,
      contact_name: parsed.data.contactName,
      ...(ownedStartup.status === 'rejected' ? { status: 'pending' } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', ownedStartup.id)
    .eq('owner_id', authResult.userId)
    .select('id,slug,name,description,full_description,industry,size,funding_stage,founded_date,location,website_url,logo_url,status')
    .single();

  if (error) {
    console.error('Error updating owned startup profile:', error);
    return NextResponse.json({ error: 'Failed to update startup profile' }, { status: 500 });
  }

  return NextResponse.json({ startup: data });
}
