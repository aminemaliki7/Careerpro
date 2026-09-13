import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { runATSAnalysis } from '@/lib/ats';
import { buildSkillGapPath } from '@/lib/skill-gap';
import type { Weakness } from '@/lib/ats';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    // cv_text is fetched here ONLY for server-side analysis. It must never
    // be included in the response body sent back to the client.
    const { data: applications, error: appsError } = await supabaseAdmin
      .from('applications')
      .select('id, job_id, job_title, company, cv_text, applied_date')
      .eq('user_id', userId)
      .order('applied_date', { ascending: false });

    if (appsError) {
      console.error('Supabase error fetching applications for skill gap:', appsError);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    const eligible = (applications || []).filter(
      (a) => a.cv_text && a.cv_text.trim().length >= 50
    );

    if (eligible.length === 0) {
      return NextResponse.json({
        analyzedApplicationsCount: 0,
        skillGap: {
          primaryRoadmap: null,
          learningPath: [],
          uncoveredSkills: [],
          estimatedTotalDuration: null,
        },
      });
    }

    const jobIds = [...new Set(eligible.map((a) => a.job_id))];

    const { data: jobs, error: jobsError } = await supabaseAdmin
      .from('jobs')
      .select('id, requirements, skills, description')
      .in('id', jobIds);

    if (jobsError) {
      console.error('Supabase error fetching jobs for skill gap:', jobsError);
    }

    const jobsById = new Map((jobs || []).map((j) => [String(j.id), j]));

    // Run ATS analysis per past application, collecting every missing skill
    // and weakness across the candidate's whole application history.
    const missingSkillCounts = new Map<string, { skill: string; count: number }>();
    const allWeaknesses: Weakness[] = [];
    const jobTitleTally = new Map<string, number>();

    for (const app of eligible) {
      const job = jobsById.get(String(app.job_id));

      const analysis = runATSAnalysis({
        cvText: app.cv_text!,
        jobTitle: app.job_title,
        company: app.company,
        requirements: job?.requirements ?? [],
        description: job?.description ?? '',
        skills: job?.skills ?? [],
      });

      for (const skill of analysis.missingSkills) {
        const key = skill.toLowerCase().trim();
        const existing = missingSkillCounts.get(key);
        if (existing) existing.count += 1;
        else missingSkillCounts.set(key, { skill, count: 1 });
      }

      allWeaknesses.push(...analysis.weaknesses);
      jobTitleTally.set(app.job_title, (jobTitleTally.get(app.job_title) ?? 0) + 1);
    }

    // Use the candidate's most-applied-to job title to pick the most
    // relevant roadmap, since that best represents their target role.
    const mostCommonJobTitle = [...jobTitleTally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
      ?? eligible[0].job_title;

    const aggregatedMissingSkills = [...missingSkillCounts.values()]
      .sort((a, b) => b.count - a.count)
      .map((entry) => entry.skill);

    const skillGap = buildSkillGapPath(aggregatedMissingSkills, allWeaknesses, mostCommonJobTitle);

    return NextResponse.json({
      analyzedApplicationsCount: eligible.length,
      basedOnJobTitle: mostCommonJobTitle,
      skillGap,
    });
  } catch (error) {
    console.error('Error building aggregate skill gap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}