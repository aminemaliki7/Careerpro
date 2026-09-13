export interface MonthPoint {
  month: string;
  value: number;
}

export type MonthSeries = MonthPoint[];

export interface AnalyticsEnvelope {
  from: string | null;
  to: string | null;
  kpis: Record<string, number | null>;
  series: MonthSeries;
  breakdowns: Record<string, Record<string, number>>;
  nullCounts: Record<string, number>;
  tables: Record<string, unknown>;
}

export interface OverviewAnalytics {
  from: string | null;
  to: string | null;
  kpis: Record<string, number | null>;
  series: Record<string, MonthSeries>;
  breakdowns: Record<string, Record<string, number>>;
  nullCounts: Record<string, number>;
  tables: Record<string, unknown>;
}

export const PIPELINE_STAGES = [
  'application',
  'review',
  'shortlisted',
  'interview',
  'offer',
  'hired',
  'rejected',
] as const;