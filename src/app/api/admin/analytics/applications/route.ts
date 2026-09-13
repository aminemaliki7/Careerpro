import { type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/authorization';
import { badRequest, ok, serverError } from '@/lib/api/errors';
import { parsePeriod, PeriodValidationError } from '@/lib/analytics/period';
import { getApplicationsAnalytics } from '@/lib/analytics/queries';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult.response) return authResult.response;

  try {
    const period = parsePeriod(request.nextUrl.searchParams);
    const payload = await getApplicationsAnalytics(period);
    return ok(payload);
  } catch (error) {
    if (error instanceof PeriodValidationError) return badRequest(error.message);
    return serverError(error, 'admin-analytics-applications');
  }
}