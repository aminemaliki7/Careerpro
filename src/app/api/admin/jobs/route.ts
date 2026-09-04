import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { requireAdmin, requireCompanyUser } from '@/lib/auth/authorization';
import { serverError, validationError, ok } from '@/lib/api/errors';
import { createJobSchema } from '@/schemas';

const JOB_LIST_COLUMNS =
  'id,title,company,slug,location,type,experience_level,salary_range,remote,featured,status,posted_date,updated_date,created_at';

// GET: admin only. No public/client consumer depends on this endpoint, so it is
// restricted to trusted admins accessing the service-role client. Returns a
// bounded set of columns (never `*`) pending/approved jobs for moderation.
export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.response) return authResult.response;

  const { data: jobs, error } = await supabaseAdmin
    .from('jobs')
    .select(JOB_LIST_COLUMNS)
    .order('posted_date', { ascending: false })
    .limit(200);

  if (error) return serverError(error, 'admin-jobs-get');

  return ok(jobs ?? []);
}

// POST: company/recruiter/founder only. Role is resolved server-side; the
// client-supplied role is ignored. Payload is validated with Zod. New jobs are
// always created in 'pending' so recruiters cannot self-publish.
export async function POST(request: NextRequest) {
  const authResult = await requireCompanyUser();
  if (authResult.response) return authResult.response;
  const { userId } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { owner_id, status, posted_date, updated_date, ...rest } = parsed.data;

  const insertPayload = {
    ...rest,
    owner_id: userId,
    status: 'pending' as const,
    posted_date: posted_date ?? new Date().toISOString(),
    updated_date: updated_date ?? new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .insert([insertPayload])
    .select()
    .single();

  if (error) return serverError(error, 'admin-jobs-post');

  return NextResponse.json(
    { message: 'Job created successfully', data },
    { status: 201 }
  );
}
