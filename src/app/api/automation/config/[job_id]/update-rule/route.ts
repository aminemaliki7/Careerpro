// src/app/api/automation/config/[job_id]/update-rule/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

const VALID_RULE_TYPES = ['auto_shortlist', 'auto_review'];
const RULE_TYPE_TO_ACTION: Record<string, string> = {
  'auto_shortlist': 'shortlisted',
  'auto_review': 'review',
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ job_id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { job_id } = await context.params;

    // Parse job_id as integer
    const jobId = parseInt(job_id, 10);
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: 'Invalid job_id format' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { rule_type, threshold, enabled } = body;

    // Validate rule_type
    if (!rule_type || !VALID_RULE_TYPES.includes(rule_type)) {
      return NextResponse.json(
        { error: `Invalid rule_type. Must be one of: ${VALID_RULE_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate threshold
    if (threshold === null || threshold === undefined || typeof threshold !== 'number') {
      return NextResponse.json(
        { error: 'Threshold is required and must be a number' },
        { status: 400 }
      );
    }

    if (threshold < 0 || threshold > 100) {
      return NextResponse.json(
        { error: 'Threshold must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validate enabled (default to true)
    const ruleEnabled = typeof enabled === 'boolean' ? enabled : true;

    // 1. Verify recruiter owns the job
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('owner_id')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError) {
      console.error('Job fetch error:', jobError);
      return NextResponse.json(
        { error: 'Failed to verify job ownership' },
        { status: 500 }
      );
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.owner_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to create/update automation rules for this job' },
        { status: 403 }
      );
    }

    // 2. Get the correct action for the rule type
    const action = RULE_TYPE_TO_ACTION[rule_type];

    // 3. Upsert rule using unique constraint (job_id, rule_type)
    // Since Supabase doesn't have direct UPSERT via JS client, we'll use insert with onConflict
    // But the client doesn't support onConflict, so we need to check and update/insert manually
    const { data: existingRule, error: checkError } = await supabaseAdmin
      .from('automation_config')
      .select('id')
      .eq('job_id', jobId)
      .eq('rule_type', rule_type)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Rule check error:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing rule' },
        { status: 500 }
      );
    }

    let result;

    if (existingRule) {
      // Update existing rule
      result = await supabaseAdmin
        .from('automation_config')
        .update({
          threshold,
          action,
          enabled: ruleEnabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRule.id)
        .select()
        .single();
    } else {
      // Create new rule
      result = await supabaseAdmin
        .from('automation_config')
        .insert({
          owner_id: userId,
          job_id: jobId,
          rule_type,
          threshold,
          action,
          enabled: ruleEnabled,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Rule upsert error:', result.error);
      return NextResponse.json(
        { error: 'Failed to save automation rule' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: existingRule ? 'Automation rule updated successfully' : 'Automation rule created successfully',
        rule: result.data,
      },
      { status: existingRule ? 200 : 201 }
    );
  } catch (error) {
    console.error('Error updating automation config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
