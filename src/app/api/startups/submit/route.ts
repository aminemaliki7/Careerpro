// app/api/startups/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs/server';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a startup.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Required fields
    const requiredFields = [
      'name',
      'description',
      'industry',
      'size',
      'fundingStage',
      'foundedDate',
      'location',
      'websiteUrl',
      'contactEmail',
      'contactName'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const slug = generateSlug(body.name);

    // Check if slug already exists (approved or pending)
    const { data: exists } = await supabase
      .from('startups')
      .select('id, status')
      .eq('slug', slug)
      .maybeSingle();

    if (exists) {
      return NextResponse.json(
        { error: 'A startup with this name already exists.' },
        { status: 409 }
      );
    }

    // Build payload with owner_id from Clerk
    const payload = {
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      full_description: body.fullDescription || null,
      industry: body.industry,
      size: body.size,
      funding_stage: body.fundingStage,
      founded_date: body.foundedDate,
      location: body.location.trim(),
      website_url: body.websiteUrl.trim(),
      logo_url: body.logoUrl || null,
      contact_email: body.contactEmail.trim(),
      contact_name: body.contactName.trim(),
      owner_id: userId, // Capture Clerk user ID as owner
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Insert into startups table
    const { data, error } = await supabase
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