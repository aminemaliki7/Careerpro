// src/lib/skill-gap.ts
// Turns a candidate's missing skills (from ATS analysis) into a personalized
// learning path, drawing on the existing static roadmap content. Never
// invents skills or steps - only surfaces roadmap steps that already exist.

import { getAllRoadmaps } from './roadmaps';
import { canonicalizeSkillLabel } from './ats';
import type { Roadmap, RoadmapStep } from '@/types/roadmap';
import type { Weakness } from './ats';

export interface SkillGapStep {
  roadmapId: string;
  roadmapTitle: string;
  step: RoadmapStep;
  coversSkills: string[]; // which of the user's missing skills this step addresses
}

export interface UncoveredSkill {
  skill: string;
  severity: 'critical' | 'moderate' | 'minor';
}

export interface SkillGapResult {
  primaryRoadmap: { id: string; title: string; totalDuration: string } | null;
  learningPath: SkillGapStep[];       // ordered steps to take, deduplicated
  uncoveredSkills: UncoveredSkill[];   // missing skills no roadmap addresses
  estimatedTotalDuration: string | null;
}

/** Lowercases, strips punctuation (keeping +, #, . for things like "C++", "C#"), collapses whitespace. */
function normalizeToken(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Score how relevant a roadmap is to a job title/category, via simple token overlap. */
function scoreRoadmapRelevance(roadmap: Roadmap, jobTitle: string): number {
  const titleTokens = normalizeToken(jobTitle)
    .split(' ')
    .filter((t) => t.length > 2);

  const roadmapTokens = new Set([
    ...normalizeToken(roadmap.title).split(' '),
    ...roadmap.tags.map((t) => normalizeToken(t)),
    normalizeToken(roadmap.category),
  ]);

  let score = 0;
  for (const token of titleTokens) {
    if (roadmapTokens.has(token)) {
      score += 2;
    } else if ([...roadmapTokens].some((rt) => rt.length > 2 && (rt.includes(token) || token.includes(rt)))) {
      score += 1;
    }
  }
  return score;
}

/**
 * Matches a missing skill (e.g. "CSS") against a roadmap step skill
 * (e.g. "CSS3"). Prefers the canonical alias table from lib/ats.ts so
 * distinct skills like "Java" and "JavaScript" never collide; falls back
 * to substring matching only for longer tokens the alias table doesn't
 * know about (e.g. "React Components", "JavaScript ES6+").
 */
function skillsMatch(missingSkill: string, stepSkill: string): boolean {
  const a = normalizeToken(missingSkill);
  const b = normalizeToken(stepSkill);
  if (!a || !b) return false;
  if (a === b) return true;

  const canonicalA = canonicalizeSkillLabel(a);
  const canonicalB = canonicalizeSkillLabel(b);
  if (canonicalA && canonicalB) return canonicalA === canonicalB;

  if (a.length >= 4 && b.length >= 4 && (b.includes(a) || a.includes(b))) return true;

  return false;
}

/** Returns the subset of missingSkills that this step's skills list covers. */
function stepSkillOverlap(step: RoadmapStep, missingSkills: string[]): string[] {
  return missingSkills.filter((missing) => step.skills.some((stepSkill) => skillsMatch(missing, stepSkill)));
}

/**
 * Builds a personalized learning path from a candidate's missing skills.
 * Picks the roadmap most relevant to the job title, pulls the specific
 * steps that cover the gaps (in step order), and falls back to other
 * roadmaps for any skill the primary roadmap doesn't address. Anything
 * still uncovered is surfaced explicitly rather than silently dropped.
 */
export function buildSkillGapPath(
  missingSkills: string[],
  weaknesses: Weakness[],
  jobTitle: string
): SkillGapResult {
  if (missingSkills.length === 0) {
    return { primaryRoadmap: null, learningPath: [], uncoveredSkills: [], estimatedTotalDuration: null };
  }

  const allRoadmaps = getAllRoadmaps();
  if (allRoadmaps.length === 0) {
    return { primaryRoadmap: null, learningPath: [], uncoveredSkills: [], estimatedTotalDuration: null };
  }

  const severityBySkill = new Map(
    weaknesses
      .filter((w) => w.type === 'missing_skill')
      .map((w) => [normalizeToken(w.label), w.severity] as const)
  );

  // 1. Pick the primary roadmap by relevance to job title
  const ranked = allRoadmaps
    .map((r) => ({ roadmap: r, score: scoreRoadmapRelevance(r, jobTitle) }))
    .sort((a, b) => b.score - a.score);

  const primary = ranked[0] && ranked[0].score > 0 ? ranked[0].roadmap : null;

  const learningPath: SkillGapStep[] = [];
  const coveredSkills = new Set<string>();

  // 2. Pull matching steps from the primary roadmap, in step order
  if (primary) {
    const sortedSteps = [...primary.steps].sort((a, b) => (a.stepNumber ?? 0) - (b.stepNumber ?? 0));

    for (const step of sortedSteps) {
      const remaining = missingSkills.filter((s) => !coveredSkills.has(normalizeToken(s)));
      if (remaining.length === 0) break;

      const covers = stepSkillOverlap(step, remaining);
      if (covers.length > 0) {
        learningPath.push({ roadmapId: primary.id, roadmapTitle: primary.title, step, coversSkills: covers });
        covers.forEach((c) => coveredSkills.add(normalizeToken(c)));
      }
    }
  }

  // 3. For any skill the primary roadmap didn't cover, search all other roadmaps
  let stillMissing = missingSkills.filter((s) => !coveredSkills.has(normalizeToken(s)));
  if (stillMissing.length > 0) {
    for (const roadmap of allRoadmaps) {
      if (roadmap.id === primary?.id) continue;
      if (stillMissing.length === 0) break;

      for (const step of roadmap.steps) {
        if (stillMissing.length === 0) break;

        const covers = stepSkillOverlap(step, stillMissing);
        if (covers.length > 0) {
          learningPath.push({ roadmapId: roadmap.id, roadmapTitle: roadmap.title, step, coversSkills: covers });
          covers.forEach((c) => coveredSkills.add(normalizeToken(c)));
          stillMissing = stillMissing.filter((s) => !coveredSkills.has(normalizeToken(s)));
        }
      }
    }
  }

  // 4. Anything still uncovered gets surfaced explicitly, not silently dropped
  const uncoveredSkills: UncoveredSkill[] = missingSkills
    .filter((s) => !coveredSkills.has(normalizeToken(s)))
    .map((s) => ({
      skill: s,
      severity: severityBySkill.get(normalizeToken(s)) ?? 'moderate',
    }));

  return {
    primaryRoadmap: primary ? { id: primary.id, title: primary.title, totalDuration: primary.totalDuration } : null,
    learningPath,
    uncoveredSkills,
    estimatedTotalDuration: primary?.totalDuration ?? null,
  };
}
