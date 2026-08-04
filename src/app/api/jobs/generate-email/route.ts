import { NextRequest, NextResponse } from 'next/server';

/**
 * Helper to match requirements against the candidate's CV text
 */
function extractMatches(cvText: string, requirements: string[], skills: string[]) {
  const lowerCv = cvText.toLowerCase();

  // Find requirements or skills that explicitly appear in the CV text
  const matchedRequirements = requirements.filter((req) =>
    req.toLowerCase().split(' ').some((word) => word.length > 3 && lowerCv.includes(word))
  );

  const matchedSkills = skills.filter((skill) =>
    lowerCv.includes(skill.toLowerCase())
  );

  return {
    matchedRequirements: matchedRequirements.length > 0 ? matchedRequirements : requirements,
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : skills,
  };
}

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

    const parsedRequirements = Array.isArray(requirements) && requirements.length > 0 ? requirements : [];
    const parsedSkills = Array.isArray(skills) && skills.length > 0 ? skills : [];

    // Analyze CV text against requested skills & requirements
    const { matchedRequirements, matchedSkills } = extractMatches(cvText, parsedRequirements, parsedSkills);

    // Format specific matches for inclusion in the body
    const topSkills = matchedSkills.slice(0, 3).join(', ') || 'key industry competencies';
    const primaryReq = matchedRequirements[0] || 'the core demands of the position';
    const secondaryReq = matchedRequirements[1] || 'delivering high-quality outcomes';

    const emailContent = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} role at ${company}. After reviewing the job description and key requirements, I am confident that my background closely aligns with what you are looking for in this position.

Specifically, your requirement for experience in ${primaryReq} directly matches my practical background. My CV reflects proven experience in ${topSkills}, which has prepared me to tackle challenges such as ${secondaryReq} effectively from day one.

I am enthusiastic about the work ${company} is doing and would welcome the opportunity to discuss how my specific skills and past experience fulfill your requirements for the ${jobTitle} position.

Thank you for your time and consideration.

Best regards,
${userName}`;

    return NextResponse.json({ emailContent });
  } catch (error) {
    console.error('Error generating requirement-matched email template:', error);
    return NextResponse.json(
      { error: 'Failed to generate application email.' },
      { status: 500 }
    );
  }
}