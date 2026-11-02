import { NextRequest, NextResponse } from 'next/server';
import { founderOpportunitySchema } from '@/schemas';
import { requireCompanyUser } from '@/lib/auth/authorization';
import { supabaseAdmin } from '@/lib/supabase/admin';

const opportunityIdSchema = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireCompanyUser();
  if (authResult.response) return authResult.response;

  const { id } = await params;
  if (!opportunityIdSchema.test(id)) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const action = typeof body === 'object' && body !== null && 'action' in body
    ? body.action
    : 'update';
  if (action !== 'update' && action !== 'unpublish') {
    return NextResponse.json({ error: 'Invalid opportunity action' }, { status: 400 });
  }

  const { data: opportunity, error: opportunityError } = await supabaseAdmin
    .from('jobs')
    .select('id,startup_id,status')
    .eq('id', id)
    .eq('owner_id', authResult.userId)
    .not('startup_id', 'is', null)
    .maybeSingle();

  if (opportunityError) {
    console.error('Error verifying opportunity ownership:', opportunityError);
    return NextResponse.json({ error: 'Unable to verify opportunity ownership' }, { status: 500 });
  }
  if (!opportunity?.startup_id) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }

  const { data: startup, error: startupError } = await supabaseAdmin
    .from('startups')
    .select('id')
    .eq('id', opportunity.startup_id)
    .eq('owner_id', authResult.userId)
    .maybeSingle();

  if (startupError) {
    console.error('Error verifying opportunity startup ownership:', startupError);
    return NextResponse.json({ error: 'Unable to verify startup ownership' }, { status: 500 });
  }
  if (!startup) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }

  if (action === 'unpublish') {
    if (opportunity.status !== 'approved') {
      return NextResponse.json(
        { error: 'Only published opportunities can be unpublished.' },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .update({ status: 'closed', updated_date: new Date().toISOString() })
      .eq('id', id)
      .eq('startup_id', startup.id)
      .eq('owner_id', authResult.userId)
      .eq('status', 'approved')
      .select('id,status')
      .maybeSingle();

    if (error) {
      console.error('Error unpublishing startup opportunity:', error);
      return NextResponse.json({ error: 'Unable to unpublish opportunity' }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Opportunity status changed. Refresh and try again.' }, { status: 409 });
    }

    return NextResponse.json({ opportunity: data });
  }

  const parsed = founderOpportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid opportunity details' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .update({
      title: parsed.data.title,
      type: parsed.data.type,
      location: parsed.data.location?.trim() || null,
      remote: parsed.data.remote,
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      skills: parsed.data.skills,
      salary_range: parsed.data.compensationType === 'paid' ? parsed.data.salaryRange || null : null,
      compensation_type: parsed.data.compensationType,
      status: 'pending',
      updated_date: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('startup_id', startup.id)
    .eq('owner_id', authResult.userId)
    .eq('status', opportunity.status)
    .select('id,startup_id,title,company,type,location,remote,description,requirements,skills,salary_range,compensation_type,slug,status,posted_date')
    .maybeSingle();

  if (error) {
    console.error('Error updating startup opportunity:', error);
    return NextResponse.json({ error: 'Unable to update opportunity' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Opportunity status changed. Refresh and try again.' }, { status: 409 });
  }

  return NextResponse.json({ opportunity: data });
}
