import { z } from 'zod';

export interface AnalyticsPeriod {
  from: string | null;
  to: string | null;
}

export class PeriodValidationError extends Error {}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const periodSchema = z.object({
  from: z.string().regex(DATE_RE).optional(),
  to: z.string().regex(DATE_RE).optional(),
});

export function parsePeriod(params: URLSearchParams): AnalyticsPeriod {
  const parsed = periodSchema.safeParse({
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined,
  });
  if (!parsed.success) {
    throw new PeriodValidationError(
      'Invalid date range. Use YYYY-MM-DD values for from/to.'
    );
  }
  const { from, to } = parsed.data;
  if (from && to && from > to) {
    throw new PeriodValidationError('Invalid date range: "from" must be <= "to".');
  }
  return { from: from ?? null, to: to ?? null };
}

export function rangeStart(period: AnalyticsPeriod): string | null {
  return period.from ? `${period.from}T00:00:00.000Z` : null;
}

export function rangeEnd(period: AnalyticsPeriod): string | null {
  return period.to ? `${period.to}T23:59:59.999Z` : null;
}

export function monthKey(iso?: string | null): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})/.exec(iso);
  return match ? `${match[1]}-${match[2]}` : null;
}

export function inRange(iso: string | null, period: AnalyticsPeriod): boolean {
  if (!iso) return false;
  const start = rangeStart(period);
  const end = rangeEnd(period);
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return false;
  if (start && time < Date.parse(start)) return false;
  if (end && time > Date.parse(end)) return false;
  return true;
}

export function seriesByMonth<T>(
  source: T[],
  pick: (row: T) => string | null
): { month: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const row of source) {
    const key = monthKey(pick(row));
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function countBy<T>(
  source: T[],
  keyOf: (row: T) => string | null
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of source) {
    const key = keyOf(row);
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}