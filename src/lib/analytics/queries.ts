import { supabaseAdmin } from '@/lib/supabase/admin';
import { getEpisodeMeta, getPostMeta } from '@/lib/analytics/content';
import {
  type AnalyticsPeriod,
  countBy,
  inRange,
  rangeEnd,
  rangeStart,
  seriesByMonth,
} from '@/lib/analytics/period';
import {
  PIPELINE_STAGES,
  type AnalyticsEnvelope,
  type MonthSeries,
  type OverviewAnalytics,
} from '@/lib/analytics/types';

const JOB_COLS =
  'id,title,company,slug,type,location,experience_level,salary_range,remote,featured,status,owner_id,posted_date,updated_date,created_at';

const APP_COLS =
  'id,user_id,job_id,status,pipeline_stage,ai_applied,ats_score,applied_date,created_at,contacted_date';

const STARTUP_COLS =
  'id,name,slug,industry,size,funding_stage,location,status,created_at';

const MS_PER_DAY = 86_400_000;

type JobRow = {
  id: unknown;
  title: string | null;
  company: string | null;
  type: string | null;
  location: string | null;
  experience_level: string | null;
  salary_range: string | null;
  remote: boolean | null;
  featured: boolean | null;
  status: string | null;
  owner_id: string | null;
  posted_date: string | null;
  updated_date: string | null;
};

type AppRow = {
  id: string;
  user_id: string | null;
  job_id: unknown;
  status: string | null;
  pipeline_stage: string | null;
  ai_applied: boolean | null;
  ats_score: number | null;
  applied_date: string | null;
  created_at: string | null;
  contacted_date: string | null;
};

type StartupRow = {
  id: string;
  name: string | null;
  slug: string | null;
  industry: string | null;
  size: string | null;
  funding_stage: string | null;
  location: string | null;
  status: string | null;
  created_at: string | null;
};

type ListenSessionRow = {
  episode_slug: string | null;
  started_at: string | null;
  duration_seconds: number | null;
  is_active: boolean | null;
  user_agent: string | null;
};

function emptyEnvelope(period: AnalyticsPeriod): AnalyticsEnvelope {
  return {
    from: period.from,
    to: period.to,
    kpis: {},
    series: [],
    breakdowns: {},
    nullCounts: {},
    tables: {},
  };
}

function buildOr(columns: string[], period: AnalyticsPeriod): string | null {
  const start = rangeStart(period);
  const end = rangeEnd(period);
  const predicates: string[] = [];
  for (const column of columns) {
    const parts: string[] = [];
    if (start) parts.push(`${column}.gte.${start}`);
    if (end) parts.push(`${column}.lte.${end}`);
    if (parts.length) predicates.push(`and(${parts.join(',')})`);
  }
  return predicates.length ? predicates.join(',') : null;
}

async function fetchJobs(period: AnalyticsPeriod): Promise<JobRow[]> {
  let query = supabaseAdmin.from('jobs').select(JOB_COLS);
  const or = buildOr(['posted_date'], period);
  if (or) query = query.or(or);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as JobRow[];
}

async function fetchApplications(period: AnalyticsPeriod): Promise<AppRow[]> {
  // COALESCE(applied_date, created_at) cannot be expressed in PostgREST
  // filters, so widen with an OR predicate across both columns and re-filter
  // in-process to enforce the exact effective-date semantics.
  let query = supabaseAdmin.from('applications').select(APP_COLS);
  const or = buildOr(['applied_date', 'created_at'], period);
  if (or) query = query.or(or);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as AppRow[];
}

async function fetchApplicationUserIds(
  period: AnalyticsPeriod
): Promise<Array<{ user_id: string | null }>> {
  let query = supabaseAdmin.from('applications').select('user_id');
  const or = buildOr(['applied_date', 'created_at'], period);
  if (or) query = query.or(or);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Array<{ user_id: string | null }>;
}

function effectiveDate(row: AppRow): string | null {
  return row.applied_date ?? row.created_at ?? null;
}

async function fetchStartups(period: AnalyticsPeriod): Promise<StartupRow[]> {
  let query = supabaseAdmin.from('startups').select(STARTUP_COLS);
  const or = buildOr(['created_at'], period);
  if (or) query = query.or(or);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as StartupRow[];
}

async function fetchListenSessions(
  period: AnalyticsPeriod
): Promise<ListenSessionRow[]> {
  if (!period.from && !period.to) return [];
  let query = supabaseAdmin
    .from('podcast_listens')
    .select('episode_slug, started_at, duration_seconds, is_active, user_agent');
  const or = buildOr(['started_at'], period);
  if (or) query = query.or(or);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ListenSessionRow[];
}

function avgDays(pairs: Array<[string, string]>): number | null {
  if (!pairs.length) return null;
  const values: number[] = [];
  for (const [from, to] of pairs) {
    const diff = Date.parse(to) - Date.parse(from);
    if (Number.isNaN(diff) || diff <= 0) continue;
    values.push(diff / MS_PER_DAY);
  }
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

export async function getJobsAnalytics(
  period: AnalyticsPeriod
): Promise<AnalyticsEnvelope> {
  const envelope = emptyEnvelope(period);
  const rows = await fetchJobs(period);

  const byStatus = countBy(rows, (row) => row.status);
  envelope.kpis = {
    total: rows.length,
    approved: byStatus['approved'] ?? 0,
    pending: byStatus['pending'] ?? 0,
    rejected: byStatus['rejected'] ?? 0,
    featured: rows.filter((row) => row.featured === true).length,
    remote: rows.filter((row) => row.remote === true).length,
    avgTimeToApprovalDays: avgDays(
      rows
        .filter(
          (row) =>
            row.status === 'approved' && row.posted_date && row.updated_date
        )
        .map((row) => [row.posted_date as string, row.updated_date as string])
    ),
    activeRecruiters: new Set(
      rows.map((row) => row.owner_id).filter((id): id is string => Boolean(id))
    ).size,
  };
  envelope.series = seriesByMonth(rows, (row) => row.posted_date);
  envelope.breakdowns = {
    status: byStatus,
    type: countBy(rows, (row) => row.type),
    location: countBy(rows, (row) => row.location),
    experienceLevel: countBy(rows, (row) => row.experience_level),
    salaryRange: countBy(rows, (row) => row.salary_range),
  };
  envelope.nullCounts = {
    posted_date_missing: rows.filter((row) => !row.posted_date).length,
    updated_date_missing_on_approved: rows.filter(
      (row) => row.status === 'approved' && !row.updated_date
    ).length,
  };

  const savedRows = await supabaseAdmin.from('saved_jobs').select('id, job_id, saved_at');
  if (savedRows.error) throw savedRows.error;
  const savedCount = new Map<string, number>();
  for (const row of savedRows.data ?? []) {
    const jobId = String(row.job_id);
    savedCount.set(jobId, (savedCount.get(jobId) ?? 0) + 1);
  }
  const top = [...savedCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([jobId, count]) => ({ job_id: jobId, saved_count: count }));
  const jobLabels: Record<string, { title: string | null; company: string | null }> = {};
  if (top.length) {
    const jobLookup = await supabaseAdmin
      .from('jobs')
      .select('id, title, company')
      .in('id', top.map((entry) => entry.job_id));
    if (jobLookup.error) throw jobLookup.error;
    for (const job of jobLookup.data ?? []) {
      jobLabels[String(job.id)] = { title: job.title, company: job.company };
    }
  }
  envelope.tables = {
    topSavedJobs: top.map((entry) => ({
      ...entry,
      ...(jobLabels[entry.job_id] ?? { title: null, company: null }),
    })),
  };

  return envelope;
}

export async function getApplicationsAnalytics(
  period: AnalyticsPeriod
): Promise<AnalyticsEnvelope> {
  const envelope = emptyEnvelope(period);
  const rows = await fetchApplications(period);

  const inPeriod = rows.filter((row) => inRange(effectiveDate(row), period));
  const byStatus = countBy(inPeriod, (row) => row.status);
  const byPipeline = countBy(inPeriod, (row) => row.pipeline_stage);
  const aiApplied = inPeriod.filter((row) => row.ai_applied === true).length;
  const hiresByPipeline = inPeriod.filter((row) => row.pipeline_stage === 'hired').length;
  const rejectsByPipeline = inPeriod.filter((row) => row.pipeline_stage === 'rejected')
    .length;
  const scored = inPeriod
    .map((row) => row.ats_score)
    .filter((score): score is number => typeof score === 'number' && !Number.isNaN(score));

  let totalAllTime = rows.length;
  if (period.from || period.to) {
    const count = await supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true });
    if (count.error) throw count.error;
    totalAllTime = count.count ?? rows.length;
  }

  const atsBuckets: Record<string, number> = { '0-24': 0, '25-49': 0, '50-74': 0, '75-100': 0 };
  for (const row of inPeriod) {
    if (typeof row.ats_score !== 'number') continue;
    if (row.ats_score < 25) atsBuckets['0-24'] += 1;
    else if (row.ats_score < 50) atsBuckets['25-49'] += 1;
    else if (row.ats_score < 75) atsBuckets['50-74'] += 1;
    else atsBuckets['75-100'] += 1;
  }

  envelope.kpis = {
    totalAllTime,
    totalInPeriod: inPeriod.length,
    aiApplied,
    manualApplied: inPeriod.length - aiApplied,
    hiresByPipeline,
    rejectsByPipeline,
    interviewsByStatus: byStatus['interview'] ?? 0,
    avgAtsScore:
      scored.length > 0
        ? Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10
        : null,
    avgTimeToContactDays: avgDays(
      inPeriod
        .filter((row) => row.contacted_date && effectiveDate(row))
        .map((row) => [effectiveDate(row) as string, row.contacted_date as string])
    ),
  };
  envelope.series = seriesByMonth(inPeriod, (row) => effectiveDate(row));
  envelope.breakdowns = {
    status: byStatus,
    pipeline: byPipeline,
    atsScore: atsBuckets,
  };
  envelope.nullCounts = {
    applied_date_missing: rows.filter((row) => !row.applied_date).length,
    effective_date_missing: rows.filter((row) => !effectiveDate(row)).length,
    excluded_by_range_or_missing_date: rows.length - inPeriod.length,
    ats_score_missing: inPeriod.filter((row) => row.ats_score === null).length,
  };

  const bookmarks = await supabaseAdmin
    .from('saved_jobs')
    .select('job_id', { count: 'exact', head: true });
  if (bookmarks.error) throw bookmarks.error;

  envelope.tables = {
    funnel: PIPELINE_STAGES.map((stage) => ({
      stage,
      count: byPipeline[stage] ?? 0,
    })),
    totalBookmarks: bookmarks.count ?? 0,
  };

  return envelope;
}

export async function getContentAnalytics(
  period: AnalyticsPeriod
): Promise<AnalyticsEnvelope> {
  const envelope = emptyEnvelope(period);
  const posts = await getPostMeta();
  const episodes = await getEpisodeMeta();

  const clapRows = await supabaseAdmin
    .from('post_appreciations')
    .select('post_slug, total_claps');
  if (clapRows.error) throw clapRows.error;
  const clapMap = new Map<string, number>();
  for (const row of clapRows.data ?? []) {
    const value = Number(row.total_claps);
    if (!Number.isNaN(value)) clapMap.set(String(row.post_slug), value);
  }

  const statRows = await supabaseAdmin
    .from('podcast_stats')
    .select('episode_slug, total_listens, total_duration_seconds');
  if (statRows.error) throw statRows.error;
  const listenMap = new Map<string, number>();
  const durationMap = new Map<string, number>();
  for (const row of statRows.data ?? []) {
    const slug = String(row.episode_slug);
    const listens = Number(row.total_listens);
    const seconds = Number(row.total_duration_seconds);
    if (!Number.isNaN(listens)) listenMap.set(slug, listens);
    if (!Number.isNaN(seconds)) durationMap.set(slug, seconds);
  }

  const totalClaps = [...clapMap.values()].reduce((a, b) => a + b, 0);
  const totalListensAllTime = [...listenMap.values()].reduce((a, b) => a + b, 0);
  const totalListenSecondsAllTime = [...durationMap.values()].reduce((a, b) => a + b, 0);

  const sessions = await fetchListenSessions(period);
  const episodesMissingDuration = episodes.filter((e) => e.audioDuration === null).length;
  const durationBySlug = new Map(
    episodes.map((e) => [e.slug, e.audioDuration as number | null])
  );

  const sessionDurations = sessions
    .map((s) => s.duration_seconds)
    .filter((d): d is number => typeof d === 'number' && !Number.isNaN(d));
  const completionRatios: number[] = [];
  let sessionsWithMissingDuration = 0;
  for (const session of sessions) {
    if (typeof session.duration_seconds !== 'number') continue;
    const episodeDuration = session.episode_slug
      ? durationBySlug.get(session.episode_slug)
      : null;
    if (typeof episodeDuration !== 'number' || episodeDuration <= 0) {
      sessionsWithMissingDuration += 1;
      continue;
    }
    completionRatios.push(
      Math.min(1, Math.max(0, session.duration_seconds / episodeDuration))
    );
  }

  const userAgents = sessions
    .map((s) => s.user_agent)
    .filter((ua): ua is string => typeof ua === 'string' && ua.length > 0);
  const device = { mobile: 0, desktop: 0, unknown: sessions.length - userAgents.length };
  for (const ua of userAgents) {
    if (/(iPhone|Android|iPad|Mobile)/i.test(ua)) device.mobile += 1;
    else device.desktop += 1;
  }

  envelope.kpis = {
    totalPosts: posts.length,
    totalPodcastEpisodes: episodes.length,
    totalClaps,
    avgClapsPerPost:
      posts.length > 0 ? Math.round((totalClaps / posts.length) * 100) / 100 : null,
    totalListensAllTime,
    totalListenSecondsAllTime,
    avgListensPerEpisode:
      episodes.length > 0
        ? Math.round((totalListensAllTime / episodes.length) * 100) / 100
        : null,
    listensInPeriod: sessions.length,
    avgSessionDurationSeconds:
      sessionDurations.length > 0
        ? Math.round(
            (sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length) * 10
          ) / 10
        : null,
    avgCompletionRate:
      completionRatios.length > 0
        ? Math.round(
            (completionRatios.reduce((a, b) => a + b, 0) / completionRatios.length) * 100
          ) / 100
        : null,
  };
  envelope.series = seriesByMonth(sessions, (s) => s.started_at);
  envelope.breakdowns = {
    device,
  };
  envelope.nullCounts = {
    episodes_without_duration: episodesMissingDuration,
    sessions_without_episode_duration: sessionsWithMissingDuration,
    sessions_without_duration_seconds: sessions.length - sessionDurations.length,
    posts_without_published_at: posts.filter((p) => !p.publishedAt).length,
    episodes_without_published_at: episodes.filter((e) => !e.publishedAt).length,
  };
  envelope.tables = {
    // LEFT JOIN semantics: zero-activity content is included with 0.
    topPosts: posts
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        publishedAt: post.publishedAt,
        total_claps: clapMap.get(post.slug) ?? 0,
      }))
      .sort((a, b) => b.total_claps - a.total_claps)
      .slice(0, 10),
    topEpisodes: episodes
      .map((episode) => ({
        slug: episode.slug,
        title: episode.title,
        publishedAt: episode.publishedAt,
        audioDuration: episode.audioDuration,
        total_listens: listenMap.get(episode.slug) ?? 0,
      }))
      .sort((a, b) => b.total_listens - a.total_listens)
      .slice(0, 10),
  };

  return envelope;
}

export async function getStartupsAnalytics(
  period: AnalyticsPeriod
): Promise<AnalyticsEnvelope> {
  const envelope = emptyEnvelope(period);
  const rows = await fetchStartups(period);

  const byStatus = countBy(rows, (row) => row.status);
  envelope.kpis = {
    total: rows.length,
    approved: byStatus['approved'] ?? 0,
    pending: byStatus['pending'] ?? 0,
    rejected: byStatus['rejected'] ?? 0,
  };
  envelope.series = seriesByMonth(rows, (row) => row.created_at);
  envelope.breakdowns = {
    status: byStatus,
    industry: countBy(rows, (row) => row.industry),
    size: countBy(rows, (row) => row.size),
    fundingStage: countBy(rows, (row) => row.funding_stage),
    location: countBy(rows, (row) => row.location),
  };
  envelope.nullCounts = {
    created_at_missing: rows.filter((row) => !row.created_at).length,
  };

  const approvedJobs = await supabaseAdmin
    .from('jobs')
    .select('company')
    .eq('status', 'approved');
  if (approvedJobs.error) throw approvedJobs.error;

  const companyCount = new Map<string, number>();
  for (const job of approvedJobs.data ?? []) {
    const key = String(job.company ?? '').trim().toLowerCase();
    if (key) companyCount.set(key, (companyCount.get(key) ?? 0) + 1);
  }
  const counted = rows
    .map((startup) => {
      const key = String(startup.name ?? '').trim().toLowerCase();
      return {
        name: startup.name,
        slug: startup.slug,
        approved_jobs: companyCount.get(key) ?? 0,
      };
    })
    .sort((a, b) => b.approved_jobs - a.approved_jobs);
  const startupsWithJobs = counted.filter((s) => s.approved_jobs > 0).length;

  envelope.kpis.startupsWithApprovedJobs = startupsWithJobs;
  envelope.tables = {
    jobsPerStartup: counted.slice(0, 8),
  };

  return envelope;
}

export async function getOverviewAnalytics(
  period: AnalyticsPeriod
): Promise<OverviewAnalytics> {
  const jobs = await getJobsAnalytics(period);
  const applications = await getApplicationsAnalytics(period);
  const content = await getContentAnalytics(period);
  const startups = await getStartupsAnalytics(period);

  const subscribers = await supabaseAdmin
    .from('emails')
    .select('email', { count: 'exact', head: true });
  if (subscribers.error) throw subscribers.error;

  const contactLeads = await supabaseAdmin
    .from('contact_submissions')
    .select('id', { count: 'exact', head: true });
  if (contactLeads.error) throw contactLeads.error;

  const bookmarks = await supabaseAdmin
    .from('saved_jobs')
    .select('job_id', { count: 'exact', head: true });
  if (bookmarks.error) throw bookmarks.error;

  const roles = await supabaseAdmin.from('user_profiles').select('role, created_at');
  if (roles.error) throw roles.error;

  const candidateIds = await fetchApplicationUserIds(period);
  const activeCandidates = new Set(
    candidateIds.map((row) => row.user_id).filter((id): id is string => Boolean(id))
  ).size;

  const sessions = await fetchListenSessions(period);
  const listensSeries: MonthSeries = seriesByMonth(sessions, (s) => s.started_at);

  const roleCounts = countBy(roles.data ?? [], (row) => row.role);
  const roleOrder = ['candidate', 'founder', 'recruiter', 'company', 'admin'] as const;
  const orderedRoles: Record<string, number> = {};
  for (const role of roleOrder) {
    if (roleCounts[role]) orderedRoles[role] = roleCounts[role];
  }

  return {
    from: period.from,
    to: period.to,
    kpis: {
      approvedJobs: jobs.kpis.approved,
      pendingJobs: jobs.kpis.pending,
      activeRecruiters: jobs.kpis.activeRecruiters,
      approvedStartups: startups.kpis.approved,
      pendingStartups: startups.kpis.pending,
      totalApplications: applications.kpis.totalInPeriod,
      hiresByPipeline: applications.kpis.hiresByPipeline,
      rejectsByPipeline: applications.kpis.rejectsByPipeline,
      interviewsByStatus: applications.kpis.interviewsByStatus,
      avgAtsScore: applications.kpis.avgAtsScore,
      subscribers: subscribers.count ?? 0,
      contactLeads: contactLeads.count ?? 0,
      totalBookmarks: bookmarks.count ?? 0,
      totalClaps: content.kpis.totalClaps,
      totalListensAllTime: content.kpis.totalListensAllTime,
      listensInPeriod: sessions.length,
      activeCandidates,
      totalUsers: roles.data?.length ?? 0,
    },
    series: {
      applications: applications.series,
      jobs: jobs.series,
      startups: startups.series,
      listens: listensSeries,
    },
    breakdowns: {
      roles: orderedRoles,
      jobStatus: jobs.breakdowns.status,
      startupStatus: startups.breakdowns.status,
      applicationPipeline: applications.breakdowns.pipeline,
    },
    nullCounts: {
      applied_date_missing: applications.nullCounts.applied_date_missing,
      effective_date_missing: applications.nullCounts.effective_date_missing,
    },
    tables: {},
  };
}