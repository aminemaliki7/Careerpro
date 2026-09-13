import { NextRequest, NextResponse } from 'next/server';
import { runATSAnalysis } from '@/lib/ats';
import { buildSkillGapPath } from '@/lib/skill-gap';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cvText, jobTitle, company, requirements, description, skills } = body;

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: 'CV must be at least 50 characters' }, { status: 400 });
    }
    if (!jobTitle || !company) {
      return NextResponse.json({ error: 'Job title and company are required' }, { status: 400 });
    }

    const analysis = runATSAnalysis({ cvText, jobTitle, company, requirements, description, skills });
    const skillGap = buildSkillGapPath(analysis.missingSkills, analysis.weaknesses, jobTitle);

    return NextResponse.json({ analysis, skillGap });
  } catch (error) {
    console.error('❌ Skill gap error:', error);
    return NextResponse.json({ error: 'Failed to build skill gap path' }, { status: 500 });
  }
}