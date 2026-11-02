// app/api/startups/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireCompanyUser } from '@/lib/auth/authorization';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { startupSubmissionSchema } from '@/schemas';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireCompanyUser();
    if (authResult.response) return authResult.response;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = startupSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid startup submission' },
        { status: 400 }
      );
    }

    const slug = generateSlug(parsed.data.name);
    if (!slug) {
      return NextResponse.json({ error: 'Startup name must contain letters or numbers' }, { status: 400 });
    }

    const { data: exists, error: lookupError } = await supabaseAdmin
      .from('startups')
      .select('id, status')
      .eq('slug', slug)
      .maybeSingle();

    if (lookupError) {
      console.error('Startup slug lookup error:', lookupError);
      return NextResponse.json({ error: 'Failed to verify startup name' }, { status: 500 });
    }

    if (exists) {
      return NextResponse.json(
        { error: 'A startup with this name already exists.' },
        { status: 409 }
      );
    }

    // Build payload with owner_id from Clerk
    const payload = {
      name: parsed.data.name,
      slug,
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
      owner_id: authResult.userId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('startups')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit startup' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Startup submitted successfully! Pending approval.',
        startup: data
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}