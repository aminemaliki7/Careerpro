// src/lib/cv-optimizer.ts
import type { ATSAnalysis } from './ats';

export interface OptimizationSuggestion {
  type: 'add_keyword' | 'rephrase' | 'quantify' | 'structure' | 'reorder';
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;       // explanation, always conditional/user-driven, never asserts fabricated fact
  example?: string;      // optional sample phrasing the user can adapt IF true for them
}

export interface CvOptimizationResult {
  suggestions: OptimizationSuggestion[];
  missingCriticalCount: number;
  quickWinsCount: number; // suggestions the user can act on in under 2 minutes
}

/**
 * Generates CV improvement suggestions from an existing ATSAnalysis.
 * Never fabricates experience - every suggestion is either a conditional
 * prompt ("if you've done X, add it") or a structural/phrasing fix applied
 * to content already present in the CV.
 */
export function generateOptimizationSuggestions(
  analysis: ATSAnalysis,
  cvText: string,
  description?: string
): CvOptimizationResult {
  const suggestions: OptimizationSuggestion[] = [];
  const lowerCv = cvText.toLowerCase();

  // 1. Missing CRITICAL skills that share a category with skills already in the CV
  //    →’ high confidence the user might just be missing the exact term, not the experience
  const criticalMissing = analysis.weaknesses.filter(
    (w) => w.type === 'missing_skill' && w.severity === 'critical'
  );

  for (const w of criticalMissing) {
    const relatedCategory = Object.entries(analysis.detailed.skillsByCategory).find(([, skills]) =>
      skills.some((s) => s.toLowerCase() !== w.label.toLowerCase())
    );

    suggestions.push({
      type: 'add_keyword',
      priority: 'high',
      title: `Required skill not found: "${w.label}"`,
      detail: relatedCategory
        ? `Your CV shows other ${relatedCategory[0]} skills (${relatedCategory[1].slice(0, 3).join(', ')}). If you've also worked with "${w.label}", state it explicitly - ATS systems match exact terms, not related skills.`
        : `This is listed as a hard requirement for the role. If you have experience with "${w.label}", add it explicitly using that exact term.`,
    });
  }

  // 2. Missing NICE-TO-HAVE skills - lower priority, same non-fabrication rule
  const minorMissing = analysis.weaknesses.filter(
    (w) => w.type === 'missing_skill' && w.severity !== 'critical'
  );
  if (minorMissing.length > 0) {
    suggestions.push({
      type: 'add_keyword',
      priority: 'low',
      title: `${minorMissing.length} nice-to-have skill${minorMissing.length > 1 ? 's' : ''} not mentioned`,
      detail: `These aren't required, but including them (only if genuinely applicable) can improve your match: ${minorMissing.map((w) => w.label).join(', ')}.`,
    });
  }

  // 3. Keyword density - pull exact terms from the job description not present in CV
  //    (excludes ones already covered by skill suggestions above)
  if (description) {
    const descKeywords = analysis.detailed.keywords;
    if (descKeywords.score < 50) {
      suggestions.push({
        type: 'add_keyword',
        priority: 'medium',
        title: 'Low keyword overlap with job description',
        detail: `Only ${descKeywords.score}% of the job posting's key terms appear in your CV. Re-read the description and, wherever your existing bullet points already describe that work, mirror the job's exact phrasing rather than a synonym (e.g. if you say "customer support" but the job says "client success," and that's the same work you did, use their term).`,
      });
    }
  }

  // 4. Quantification - structural, based on existing achievements, no invention
  const hasQuantified = lowerCv.match(/\d+%|\$\d|\d+x\b|increased|reduced|improved|grew/i);
  if (!hasQuantified) {
    suggestions.push({
      type: 'quantify',
      priority: 'high',
      title: 'No quantified achievements detected',
      detail: `Recruiters and ATS scoring both weight measurable impact. Go back through your existing bullet points and add real numbers you already know - team size, % improvement, time saved, revenue, users - don't estimate or guess a figure.`,
      example: 'e.g. "Improved page load time" →’ "Improved page load time by 40% (from 3.2s to 1.9s)"',
    });
  }

  // 5. Missing summary/objective section - structural only
  if (!lowerCv.includes('summary') && !lowerCv.includes('objective') && !lowerCv.includes('profile')) {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      title: 'No professional summary at the top',
      detail: `Add a 2-3 line summary above your experience section, written using only what's already in your CV: your title, years of experience, and your strongest matched skill (${analysis.matchedSkills[0] || 'your top skill'}).`,
    });
  }

  // 6. Experience section thin - structural nudge, not content invention
  if (analysis.detailed.experience.yearsOfExperience === 0 && cvText.length > 200) {
    suggestions.push({
      type: 'structure',
      priority: 'high',
      title: 'Work experience section unclear or missing dates',
      detail: `We couldn't detect clear years of experience. Make sure each role lists a job title, company, and start/end dates in a standard format (e.g. "Jan 2022 - Present") so ATS parsers can read it correctly.`,
    });
  }

  // 7. Reordering - if matched skills exist but appear late in the document
  if (analysis.matchedSkills.length > 0) {
    const firstSkillMentionIdx = Math.min(
      ...analysis.matchedSkills.map((s) => lowerCv.indexOf(s.toLowerCase())).filter((i) => i >= 0)
    );
    const relativePosition = firstSkillMentionIdx / cvText.length;
    if (relativePosition > 0.4) {
      suggestions.push({
        type: 'reorder',
        priority: 'medium',
        title: 'Key matched skills appear late in your CV',
        detail: `Your relevant skills (${analysis.matchedSkills.slice(0, 3).join(', ')}) don't show up until deep into the document. Consider moving a skills section or summary near the top so both ATS parsers and recruiters see your strongest matches first.`,
      });
    }
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    suggestions,
    missingCriticalCount: criticalMissing.length,
    quickWinsCount: suggestions.filter((s) => s.type === 'add_keyword' || s.type === 'structure').length,
  };
}

