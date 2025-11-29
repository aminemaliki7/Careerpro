// src/app/api/jobs/ats-check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  console.log('🎯 ATS Check API called');
  
  try {
    const body = await req.json();
    const { cvText, jobTitle, company, requirements, description, skills } = body;

    console.log('📋 Request data:', {
      cvTextLength: cvText?.length,
      jobTitle,
      company,
      hasRequirements: !!requirements,
      hasSkills: !!skills,
    });

    // Validation
    if (!cvText || cvText.trim().length < 50) {
      console.log('❌ Validation failed: CV text too short');
      return NextResponse.json(
        { error: 'CV text is required and must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (!jobTitle || !company) {
      console.log('❌ Validation failed: Missing job info');
      return NextResponse.json(
        { error: 'Job title and company are required' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please add GEMINI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const requirementsText = Array.isArray(requirements) && requirements.length > 0
      ? requirements.join('\n- ')
      : 'Not specified';

    const skillsText = Array.isArray(skills) && skills.length > 0
      ? skills.join(', ')
      : 'Not specified';

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following CV against the job requirements and provide a detailed compatibility report.

JOB INFORMATION:
- Position: ${jobTitle}
- Company: ${company}
- Required Skills: ${skillsText}
- Key Requirements:
  - ${requirementsText}
- Job Description: ${description || 'Not specified'}

CANDIDATE'S CV:
${cvText}

INSTRUCTIONS:
Analyze the CV thoroughly and provide a JSON response with the following structure. Be thorough but fair in your assessment.

IMPORTANT GUIDELINES:
1. Look for skills mentioned in different ways (e.g., "JavaScript" and "JS", "React" and "ReactJS")
2. Consider both hard skills (technical) and soft skills (communication, teamwork, etc.)
3. Provide constructive, specific recommendations that the candidate can realistically implement
4. Match score should reflect overall compatibility, not just keyword matching
5. Consider relevant experience, projects, and achievements, not just keywords
6. Be encouraging but honest about gaps

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no explanations):

{
  "matchScore": <number between 0-100>,
  "matchedSkills": [<array of skills from the job that are present in the CV>],
  "missingSkills": [<array of required skills that are missing from the CV>],
  "strengths": [<array of 3-5 key strengths in the candidate's CV relevant to this role>],
  "recommendations": [<array of 3-5 specific actionable recommendations to improve the CV for this role>],
  "summary": "<brief 2-3 sentence summary of the candidate's fit for this role>"
}

Return ONLY the JSON object, no additional text, no markdown formatting, no code blocks.`;

    console.log('🤖 Calling Gemini API...');

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log('✅ Gemini API response received');

    // Parse the JSON response
    let analysis;
    try {
      // Remove potential markdown code blocks and extra text
      let cleanedText = responseText.trim();
      
      // Remove markdown code blocks
      cleanedText = cleanedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Find JSON object in the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      analysis = JSON.parse(cleanedText);
      console.log('✅ Successfully parsed Gemini response');
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response:', responseText);
      return NextResponse.json(
        { 
          error: 'Failed to parse AI analysis',
          details: 'The AI response was not in the expected format',
          rawResponse: responseText.substring(0, 500)
        },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (
      typeof analysis.matchScore !== 'number' ||
      !Array.isArray(analysis.matchedSkills) ||
      !Array.isArray(analysis.missingSkills) ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.recommendations)
    ) {
      console.error('❌ Invalid analysis structure:', analysis);
      return NextResponse.json(
        { 
          error: 'Invalid AI response structure',
          details: 'The AI response is missing required fields',
          received: Object.keys(analysis)
        },
        { status: 500 }
      );
    }

    // Ensure matchScore is within bounds
    analysis.matchScore = Math.min(100, Math.max(0, Math.round(analysis.matchScore)));

    // Ensure summary exists
    if (!analysis.summary || typeof analysis.summary !== 'string') {
      analysis.summary = `The candidate shows a ${analysis.matchScore >= 70 ? 'strong' : analysis.matchScore >= 50 ? 'good' : 'moderate'} match for the ${jobTitle} position at ${company}.`;
    }

    console.log('✅ ATS check completed successfully. Match score:', analysis.matchScore);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('❌ ATS check error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.' },
          { status: 500 }
        );
      }
      
      if (String(error).includes('404 Not Found') || String(error).includes('is not found for API version')) {
        return NextResponse.json(
          { error: 'API Model Error: The model name is invalid or your @google/generative-ai package is outdated. Please update the package and restart your server.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to analyze CV with AI',
          message: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS if needed
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