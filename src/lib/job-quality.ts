// src/lib/job-quality.ts
// Rule-based "is this opportunity worth pursuing" analysis. Combines
// signals already present on the job posting itself with company data
// from the startups table when a match can be found. No external calls.

import type { Job } from '@/types/job';
import type { Startup } from '@/types/startup';

export interface QualitySignal {
  type: 'positive' | 'concern';
  category: 'posting' | 'company';
  label: string;
  detail: string;
  severity: 'high' | 'medium' | 'low'; // for concerns: how much it should worry the candidate; for positives: how strong a signal it is
}

export type OpportunityVerdict = 'strong_opportunity' | 'solid_opportunity' | 'proceed_with_caution' | 'red_flags_present';

export interface JobQualityAnalysis {
  verdict: OpportunityVerdict;
  score: number; // 0-100
  signals: QualitySignal[];
  matchedStartup: { id: string; name: string; slug: string } | null;
}

const BUZZWORD_PATTERNS = [
  'rockstar', 'ninja', 'guru', 'wear many hats', 'work hard play hard',
  'fast-paced environment', 'like a family', 'fastpaced environment',
];

const URGENCY_PATTERNS = [
  'immediate start', 'urgent hiring', 'apply now', 'must apply immediately',
  'urgently required', 'act fast',
];

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/** Finds the startup record for a job, preferring owner_id linkage over fuzzy name matching. */
export function findMatchingStartup(job: Pick<Job, 'owner_id' | 'company'>, startups: Startup[]): Startup | null {
  if (job.owner_id) {
    const byOwner = startups.find((s) => s.ownerId === job.owner_id);
    if (byOwner) return byOwner;
  }

  const normalizedJobCompany = normalizeName(job.company);
  const byName = startups.find((s) => normalizeName(s.name) === normalizedJobCompany);
  return byName ?? null;
}

function analyzePostingSignals(job: Partial<Job>): QualitySignal[] {
  const signals: QualitySignal[] = [];
  const description = job.description || '';
  const lowerDesc = description.toLowerCase();

  // Salary transparency
  if (!job.salary_range || job.salary_range.trim().length === 0) {
    signals.push({
      type: 'concern',
      category: 'posting',
      label: 'No salary range listed',
      detail: 'Jobs without transparent salary ranges make it harder to know if the role fits your expectations before investing time in applying.',
      severity: 'medium',
    });
  } else {
    signals.push({
      type: 'positive',
      category: 'posting',
      label: 'Salary transparency',
      detail: `Salary range disclosed: ${job.salary_range}.`,
      severity: 'low',
    });
  }

  // Benefits
  if (!job.benefits || job.benefits.length === 0) {
    signals.push({
      type: 'concern',
      category: 'posting',
      label: 'No benefits listed',
      detail: 'The posting does not mention any benefits, which may mean they are limited or simply not communicated upfront.',
      severity: 'low',
    });
  }

  // Description depth
  if (description.length < 200) {
    signals.push({
      type: 'concern',
      category: 'posting',
      label: 'Thin job description',
      detail: 'The posting is quite short on detail about responsibilities and expectations - consider asking clarifying questions before applying.',
      severity: 'medium',
    });
  }

  // Buzzword / vague language density
  const buzzwordHits = BUZZWORD_PATTERNS.filter((p) => lowerDesc.includes(p));
  if (buzzwordHits.length >= 2) {
    signals.push({
      type: 'concern',
      category: 'posting',
      label: 'Vague or cliché language',
      detail: `Phrases like "${buzzwordHits.slice(0, 2).join('", "')}" often signal an unclear role definition or a demanding culture without matching structure.`,
      severity: 'low',
    });
  }

  // Urgency / pressure language
  const urgencyHits = URGENCY_PATTERNS.filter((p) => lowerDesc.includes(p));
  if (urgencyHits.length > 0) {
    signals.push({
      type: 'concern',
      category: 'posting',
      label: 'High-pressure application language',
      detail: 'The posting emphasizes urgency, which can sometimes indicate high turnover or an unplanned hiring need rather than a genuine long-term role.',
      severity: 'low',
    });
  }

  // Posting freshness
  if (job.posted_date) {
    const postedDate = new Date(job.posted_date);
    const daysOld = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysOld > 60 && !job.updated_date) {
      signals.push({
        type: 'concern',
        category: 'posting',
        label: 'Listing may be stale',
        detail: `This job was posted ${daysOld} days ago with no update since. It's worth confirming the role is still open before applying.`,
        severity: 'medium',
      });
    }
  }

  // Application deadline passed
  if (job.application_deadline) {
    const deadline = new Date(job.application_deadline);
    if (deadline.getTime() < Date.now()) {
      signals.push({
        type: 'concern',
        category: 'posting',
        label: 'Application deadline has passed',
        detail: `The listed deadline (${deadline.toLocaleDateString()}) is in the past. The role may already be filled.`,
        severity: 'high',
      });
    }
  }

  // Clear application channel
  if (job.contact_email || job.application_url) {
    signals.push({
      type: 'positive',
      category: 'posting',
      label: 'Clear application channel',
      detail: 'A direct contact or application link is provided.',
      severity: 'low',
    });
  }

  return signals;
}

function analyzeCompanySignals(startup: Startup | null): QualitySignal[] {
  if (!startup) return [];
  const signals: QualitySignal[] = [];

  // Funding stage
  const strongFunding: Startup['fundingStage'][] = ['Series B', 'Series C', 'Series D+', 'Public', 'Acquired'];
  const earlyFunding: Startup['fundingStage'][] = ['Pre-Seed', 'Seed'];

  if (strongFunding.includes(startup.fundingStage)) {
    signals.push({
      type: 'positive',
      category: 'company',
      label: `${startup.fundingStage} funded`,
      detail: 'This funding stage generally indicates a validated business model and stronger financial runway.',
      severity: 'medium',
    });
  } else if (earlyFunding.includes(startup.fundingStage)) {
    signals.push({
      type: 'concern',
      category: 'company',
      label: `${startup.fundingStage} stage company`,
      detail: 'Early-stage companies carry more risk (funding runway, role stability) but can offer faster growth and more ownership over your work - weigh this against your own risk tolerance.',
      severity: 'low',
    });
  }

  // Company size
  if (startup.size === '500+' || startup.size === '201-500') {
    signals.push({
      type: 'positive',
      category: 'company',
      label: 'Established team size',
      detail: `${startup.size} employees suggests more structure and established processes.`,
      severity: 'low',
    });
  } else if (startup.size === '1-10') {
    signals.push({
      type: 'concern',
      category: 'company',
      label: 'Very small team',
      detail: 'With 1-10 employees, expect a broad, less-defined role and less established process - common at very early startups.',
      severity: 'low',
    });
  }

  // Company age
  const founded = new Date(startup.foundedDate);
  if (!isNaN(founded.getTime())) {
    const ageInMonths = (Date.now() - founded.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (ageInMonths < 12) {
      signals.push({
        type: 'concern',
        category: 'company',
        label: 'Recently founded company',
        detail: 'Founded less than a year ago - limited track record to evaluate stability.',
        severity: 'medium',
      });
    }
  }

  // Active hiring signal
  if (startup.jobCount && startup.jobCount >= 3) {
    signals.push({
      type: 'positive',
      category: 'company',
      label: 'Actively growing team',
      detail: `Currently hiring for ${startup.jobCount} roles, suggesting active growth and investment in headcount.`,
      severity: 'low',
    });
  }

  return signals;
}

function deriveVerdict(signals: QualitySignal[]): { verdict: OpportunityVerdict; score: number } {
  const severityWeight = { high: 3, medium: 2, low: 1 };
  let score = 70; // neutral baseline

  for (const s of signals) {
    const weight = severityWeight[s.severity];
    score += s.type === 'positive' ? weight * 4 : -weight * 5;
  }
  score = Math.max(0, Math.min(100, score));

  const highConcerns = signals.filter((s) => s.type === 'concern' && s.severity === 'high').length;

  let verdict: OpportunityVerdict;
  if (highConcerns > 0 || score < 40) verdict = 'red_flags_present';
  else if (score < 60) verdict = 'proceed_with_caution';
  else if (score < 80) verdict = 'solid_opportunity';
  else verdict = 'strong_opportunity';

  return { verdict, score: Math.round(score) };
}

/**
 * Analyzes whether a job opportunity itself is worth pursuing, combining
 * posting-text signals with company data when a matching startup record
 * exists. Entirely rule-based - no external calls.
 */
export function analyzeJobQuality(job: Job, startups: Startup[]): JobQualityAnalysis {
  const matchedStartup = findMatchingStartup(job, startups);

  const signals = [
    ...analyzePostingSignals(job),
    ...analyzeCompanySignals(matchedStartup),
  ];

  const { verdict, score } = deriveVerdict(signals);

  return {
    verdict,
    score,
    signals,
    matchedStartup: matchedStartup
      ? { id: matchedStartup.id, name: matchedStartup.name, slug: matchedStartup.slug }
      : null,
  };
}
