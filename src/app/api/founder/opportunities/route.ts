import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { founderOpportunitySchema } from '@/schemas';
import { requireCompanyUser } from '@/lib/auth/authorization';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createJobSlug } from '@/lib/utils/format';

export async function POST(request: NextRequest) {
  const authResult = await requireCompanyUser();
  if (authResult.response) return authResult.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const startupId = typeof body === 'object' && body !== null && 'startupId' in body
    ? body.startupId
    : null;
  if (typeof startupId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(startupId)) {
    return NextResponse.json({ error: 'Select a valid startup profile' }, { status: 400 });
  }

  const parsed = founderOpportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid opportunity details' },
      { status: 400 }
    );
  }

  const { data: startup, error: startupError } = await supabaseAdmin
    .from('startups')
    .select('id,name,status')
    .eq('id', startupId)
    .eq('owner_id', authResult.userId)
    .maybeSingle();

  if (startupError) {
    console.error('Error verifying startup opportunity ownership:', startupError);
    return NextResponse.json({ error: 'Unable to verify startup ownership' }, { status: 500 });
  }
  if (!startup) {
    return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
  }
  if (startup.status !== 'approved') {
    return NextResponse.json(
      { error: 'Your startup profile must be approved before you can submit opportunities.' },
      { status: 409 }
    );
  }

  const titleSlug = createJobSlug(parsed.data.title) || 'opportunity';
  const { data: opportunity, error } = await supabaseAdmin
    .from('jobs')
    .insert({
      startup_id: startup.id,
      owner_id: authResult.userId,
      title: parsed.data.title,
      company: startup.name,
      type: parsed.data.type,
      location: parsed.data.location?.trim() || null,
      remote: parsed.data.remote,
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      skills: parsed.data.skills,
      benefits: [],
      experience_level: null,
      salary_range: parsed.data.compensationType === 'paid' ? parsed.data.salaryRange || null : null,
      compensation_type: parsed.data.compensationType,
      contact_email: null,
      application_url: null,
      featured: false,
      slug: `${titleSlug}-${randomUUID().slice(0, 8)}`,
      status: 'pending',
      posted_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    })
    .select('id,startup_id,title,company,type,location,remote,description,requirements,skills,salary_range,compensation_type,slug,status,posted_date')
    .single();

  if (error) {
    console.error('Error creating startup opportunity:', error);
    return NextResponse.json({ error: 'Unable to submit opportunity for review' }, { status: 500 });
  }

  return NextResponse.json({ opportunity }, { status: 201 });
}
