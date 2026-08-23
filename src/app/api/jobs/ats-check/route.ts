// src/app/api/jobs/ats-check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runATSAnalysis } from '@/lib/ats';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cvText, jobTitle, company, requirements, description, skills } = body;

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: 'CV must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (!jobTitle || !company) {
      return NextResponse.json(
        { error: 'Job title and company are required' },
        { status: 400 }
      );
    }

    const analysis = runATSAnalysis({ cvText, jobTitle, company, requirements, description, skills });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('❌ ATS check error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}