// src/app/api/jobs/generate-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { cvText, jobTitle, company, requirements, description, skills, userName } = await request.json();

    if (!cvText || !jobTitle || !company) {
      return NextResponse.json(
        { error: 'Missing required fields: CV text, job title, and company are required' },
        { status: 400 }
      );
    }

    if (!userName || userName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide your full name' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const requirementsText = Array.isArray(requirements) && requirements.length > 0
      ? requirements.join('\n- ')
      : 'Not specified';

    const skillsText = Array.isArray(skills) && skills.length > 0
      ? skills.join(', ')
      : 'Not specified';

    const prompt = `You are an expert career coach and professional email writer. Generate a compelling job application email based on the following information:

JOB DETAILS:
- Position: ${jobTitle}
- Company: ${company}
- Job Description: ${description || 'Not provided'}
- Required Skills: ${skillsText}
- Key Requirements:
  - ${requirementsText}

CANDIDATE INFORMATION:
- Name: ${userName}
- CV/RESUME:
${cvText}

INSTRUCTIONS:
1. Write a professional application email (250-350 words maximum)
2. Address the email professionally (Dear Hiring Manager, or similar)
3. Start with a strong opening that shows genuine interest in the role
4. Identify and highlight 2-3 specific experiences or achievements from the CV that directly match the job requirements
5. Demonstrate knowledge about the company (if information is available in the CV)
6. Show enthusiasm and cultural fit
7. Use a confident yet humble tone
8. End with a clear call to action
9. Sign off with "Best regards," followed by the candidate's name: ${userName}
10. DO NOT include any introductory phrases like "Here is the email" or "Of course"
11. DO NOT include "Subject:" lines
12. DO NOT include placeholders like [Your Name], [Date], [Platform where you saw the ad]
13. DO NOT use generic phrases - be specific and authentic
14. Write in a natural, conversational professional tone
15. Format with proper paragraphs for readability
16. START DIRECTLY with the greeting (e.g., "Dear Hiring Manager,")

CRITICAL: Your response should START IMMEDIATELY with "Dear Hiring Manager," or similar greeting. Do not include any preamble, explanation, or meta-commentary. Output ONLY the email content itself.

Generate the complete email:`;

    const result = await model.generateContent(prompt);
    const emailContent = result.response.text();
    
    if (!emailContent || emailContent.trim() === '') {
      console.error('Gemini AI returned an empty response.');
      return NextResponse.json(
        { error: 'Failed to generate email content. Please try again with different content.' },
        { status: 500 }
      );
    }

    // Comprehensive cleaning of the email response
    let cleanedEmail = emailContent.trim();
    
    // Remove common AI preambles and meta-commentary
    cleanedEmail = cleanedEmail
      .replace(/^(Of course[.,!]?\s*)/i, '')
      .replace(/^(Sure[.,!]?\s*)/i, '')
      .replace(/^(Certainly[.,!]?\s*)/i, '')
      .replace(/^(Here is.*?:?\s*)/i, '')
      .replace(/^(Here's.*?:?\s*)/i, '')
      .replace(/^(I'll.*?:?\s*)/i, '')
      .replace(/^(Let me.*?:?\s*)/i, '')
      .replace(/^(Below is.*?:?\s*)/i, '')
      .trim();
    
    // Remove any "Subject:" lines (including with asterisks)
    cleanedEmail = cleanedEmail
      .replace(/^\*+Subject:\*+.*?\n/gm, '')
      .replace(/^Subject:.*?\n/gm, '')
      .trim();
    
    // Remove leading asterisks or formatting markers
    cleanedEmail = cleanedEmail.replace(/^\*+\s*/, '');
    
    // Remove any lines that are just asterisks
    cleanedEmail = cleanedEmail.replace(/^\*+$/gm, '').trim();
    
    // Remove placeholder text patterns
    cleanedEmail = cleanedEmail
      .replace(/\[Platform where you saw the ad[^\]]*\]/gi, 'your job board')
      .replace(/\[Your [^\]]+\]/gi, '')
      .replace(/\[Date\]/gi, '')
      .trim();
    
    // Clean up multiple blank lines
    cleanedEmail = cleanedEmail.replace(/\n{3,}/g, '\n\n');

    return NextResponse.json({ emailContent: cleanedEmail });
  } catch (error) {
    console.error('Error generating email:', error);
    
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
        { error: `Failed to generate email: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate email. Please try again.' },
      { status: 500 }
    );
  }
}