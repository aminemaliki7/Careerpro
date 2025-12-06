// app/api/startups/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { StartupSubmission } from '@/types/startup';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body: StartupSubmission = await request.json();

    // Validate required fields
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
      if (!body[field as keyof StartupSubmission]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug
    const slug = generateSlug(body.name);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('startup_submissions')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A startup with this name already exists' },
        { status: 409 }
      );
    }

    // Map camelCase body to snake_case columns
    const submissionPayload = {
      name: body.name,
      slug,
      description: body.description,
      full_description: body.fullDescription || null,
      industry: body.industry,
      size: body.size,
      funding_stage: body.fundingStage,
      founded_date: body.foundedDate,
      location: body.location,
      website_url: body.websiteUrl,
      logo_url: body.logoUrl || null,
      contact_email: body.contactEmail,
      contact_name: body.contactName,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('startup_submissions')
      .insert([submissionPayload])
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
        message: 'Startup submitted successfully! We will review it and get back to you soon.',
        submission: data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting startup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
